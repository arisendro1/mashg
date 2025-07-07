import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertInspectionSchema, updateInspectionSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all inspections
  app.get("/api/inspections", async (req, res) => {
    try {
      const inspections = await storage.getInspections();
      res.json(inspections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inspections" });
    }
  });

  // Get inspection statistics
  app.get("/api/inspections/stats", async (req, res) => {
    try {
      const stats = await storage.getInspectionStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Get single inspection
  app.get("/api/inspections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const inspection = await storage.getInspection(id);
      
      if (!inspection) {
        return res.status(404).json({ message: "Inspection not found" });
      }
      
      res.json(inspection);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inspection" });
    }
  });

  // Search inspections
  app.get("/api/inspections/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const inspections = await storage.searchInspections(query);
      res.json(inspections);
    } catch (error) {
      res.status(500).json({ message: "Failed to search inspections" });
    }
  });

  // Filter inspections
  app.get("/api/inspections/filter", async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        inspector: req.query.inspector as string,
      };
      
      const inspections = await storage.filterInspections(filters);
      res.json(inspections);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter inspections" });
    }
  });

  // Create inspection
  app.post("/api/inspections", async (req, res) => {
    try {
      const result = insertInspectionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid inspection data",
          errors: fromZodError(result.error).toString()
        });
      }
      
      const inspection = await storage.createInspection(result.data);
      res.status(201).json(inspection);
    } catch (error) {
      res.status(500).json({ message: "Failed to create inspection" });
    }
  });

  // Update inspection
  app.patch("/api/inspections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = updateInspectionSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid inspection data",
          errors: fromZodError(result.error).toString()
        });
      }
      
      const inspection = await storage.updateInspection(id, result.data);
      if (!inspection) {
        return res.status(404).json({ message: "Inspection not found" });
      }
      
      res.json(inspection);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inspection" });
    }
  });

  // Delete inspection
  app.delete("/api/inspections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteInspection(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Inspection not found" });
      }
      
      res.json({ message: "Inspection deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete inspection" });
    }
  });

  // Get inspection statistics
  app.get("/api/inspections/stats", async (req, res) => {
    try {
      const stats = await storage.getInspectionStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Upload photos
  app.post("/api/upload/photos", upload.array('photos', 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      
      const filePaths = req.files.map(file => `/uploads/${file.filename}`);
      res.json({ filePaths });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload photos" });
    }
  });

  // Upload documents
  app.post("/api/upload/documents", upload.array('documents', 5), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      
      const filePaths = req.files.map(file => `/uploads/${file.filename}`);
      res.json({ filePaths });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload documents" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);
  return httpServer;
}
