import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertIpoSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // IPO Routes
  app.get("/api/ipos", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { search, status } = req.query;
      let ipos;

      if (search) {
        ipos = await storage.searchIpos(search as string);
      } else if (status && status !== "all") {
        ipos = await storage.getIposByStatus(status as string);
      } else {
        ipos = await storage.getAllIpos();
      }

      res.json(ipos);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/ipos/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const ipo = await storage.getIpoById(req.params.id);
      if (!ipo) {
        return res.status(404).json({ message: "IPO not found" });
      }

      res.json(ipo);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/ipos", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertIpoSchema.parse(req.body);
      const ipo = await storage.createIpo(validatedData);

      // Broadcast to all connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'IPO_CREATED',
            data: ipo
          }));
        }
      });

      res.status(201).json(ipo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });

  app.put("/api/ipos/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const partialSchema = insertIpoSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const ipo = await storage.updateIpo(req.params.id, validatedData);

      if (!ipo) {
        return res.status(404).json({ message: "IPO not found" });
      }

      // Broadcast to all connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'IPO_UPDATED',
            data: ipo
          }));
        }
      });

      res.json(ipo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });

  app.delete("/api/ipos/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const success = await storage.deleteIpo(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "IPO not found" });
      }

      // Broadcast to all connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'IPO_DELETED',
            data: { id: req.params.id }
          }));
        }
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Dashboard Analytics
  app.get("/api/dashboard/stats", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const allIpos = await storage.getAllIpos();
      
      const stats = {
        total: allIpos.length,
        upcoming: allIpos.filter(ipo => ipo.status === 'upcoming').length,
        ongoing: allIpos.filter(ipo => ipo.status === 'ongoing').length,
        newListed: allIpos.filter(ipo => ipo.status === 'new-listed').length,
        closed: allIpos.filter(ipo => ipo.status === 'closed').length
      };

      res.json(stats);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    
    ws.send(JSON.stringify({
      type: 'CONNECTED',
      message: 'Connected to Bluestock IPO Admin Dashboard'
    }));

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}
