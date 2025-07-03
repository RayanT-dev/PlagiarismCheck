import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { plagiarismService } from "./services/plagiarism";
import { plagiarismAnalysisSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/analyze", async (req, res) => {
    try {
      const analysisRequest = plagiarismAnalysisSchema.parse(req.body);
      
      const result = await plagiarismService.analyzePlagiarism(analysisRequest);
      
      // Save report to storage (without userId for now)
      const report = await storage.createPlagiarismReport({
        userId: null,
        content: analysisRequest.content,
        originalityScore: result.originalityScore,
        originalPercentage: result.originalPercentage,
        paraphrasedPercentage: result.paraphrasedPercentage,
        plagiarizedPercentage: result.plagiarizedPercentage,
        detectedIssues: result.detectedIssues,
        recommendations: result.recommendations,
        highlightedText: result.highlightedText
      });

      res.json({
        ...result,
        reportId: report.id
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      } else {
        console.error("Analysis error:", error);
        res.status(500).json({ 
          message: "Failed to analyze content. Please try again." 
        });
      }
    }
  });

  app.get("/api/report/:id", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      if (isNaN(reportId)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }

      const report = await storage.getPlagiarismReport(reportId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json(report);
    } catch (error) {
      console.error("Report retrieval error:", error);
      res.status(500).json({ message: "Failed to retrieve report" });
    }
  });

  app.post("/api/upload", async (req, res) => {
    try {
      // For now, return an error indicating file upload is not implemented
      res.status(501).json({ 
        message: "File upload feature is not yet implemented. Please paste your text directly." 
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
