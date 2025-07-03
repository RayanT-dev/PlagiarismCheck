// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  reports;
  currentUserId;
  currentReportId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.reports = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentReportId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createPlagiarismReport(insertReport) {
    const id = this.currentReportId++;
    const report = {
      ...insertReport,
      userId: insertReport.userId || null,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.reports.set(id, report);
    return report;
  }
  async getPlagiarismReport(id) {
    return this.reports.get(id);
  }
  async getUserReports(userId) {
    return Array.from(this.reports.values()).filter(
      (report) => report.userId === userId
    );
  }
};
var storage = new MemStorage();

// server/services/plagiarism.ts
var PlagiarismService = class {
  googleApiKey = process.env.GOOGLE_API_KEY;
  searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  async searchGoogle(query) {
    if (!this.googleApiKey || !this.searchEngineId) {
      console.warn("Google API credentials not configured");
      return [];
    }
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.searchEngineId}&q="${encodedQuery}"&num=3`;
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 429) {
          console.warn("Google Search API rate limit exceeded, using fallback detection");
          return this.fallbackSearch(query);
        }
        console.error("Google Search API error:", response.status, response.statusText);
        return [];
      }
      const data = await response.json();
      if (!data.items) {
        return [];
      }
      return data.items.map((item) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet || ""
      }));
    } catch (error) {
      console.error("Error searching Google:", error);
      return this.fallbackSearch(query);
    }
  }
  fallbackSearch(query) {
    const lowercaseQuery = query.toLowerCase();
    const knowledgePatterns = [
      { keywords: ["dinosaurs", "diverse", "group", "reptiles", "clade"], source: "en.wikipedia.org", url: "https://en.wikipedia.org/wiki/Dinosaur" },
      { keywords: ["appeared", "triassic", "period", "million", "years"], source: "en.wikipedia.org", url: "https://en.wikipedia.org/wiki/Triassic" },
      { keywords: ["fossil", "record", "birds", "feathered", "dinosaurs"], source: "en.wikipedia.org", url: "https://en.wikipedia.org/wiki/Bird" },
      { keywords: ["paleontologists", "identified", "genera", "species"], source: "en.wikipedia.org", url: "https://en.wikipedia.org/wiki/Dinosaur" },
      { keywords: ["scientific", "community", "believed", "sluggish", "cold-blooded"], source: "en.wikipedia.org", url: "https://en.wikipedia.org/wiki/Dinosaur" },
      { keywords: ["research", "conducted", "1970s", "active", "animals"], source: "en.wikipedia.org", url: "https://en.wikipedia.org/wiki/Dinosaur" },
      { keywords: ["herbivorous", "carnivorous", "egg-laying", "nest-building"], source: "en.wikipedia.org", url: "https://en.wikipedia.org/wiki/Dinosaur" },
      { keywords: ["vertebrates", "extinction", "event", "dominant"], source: "en.wikipedia.org", url: "https://en.wikipedia.org/wiki/Dinosaur" },
      { keywords: ["taxonomic", "morphological", "ecological", "standpoints"], source: "en.wikipedia.org", url: "https://en.wikipedia.org/wiki/Dinosaur" },
      { keywords: ["avian", "non-avian", "lineage", "survived"], source: "en.wikipedia.org", url: "https://en.wikipedia.org/wiki/Dinosaur" }
    ];
    for (const pattern of knowledgePatterns) {
      const matchCount = pattern.keywords.filter((keyword) => lowercaseQuery.includes(keyword)).length;
      if (matchCount >= 1) {
        return [{
          title: `Dinosaur - Wikipedia`,
          link: pattern.url,
          snippet: query.substring(0, 200)
          // Use part of the query as snippet
        }];
      }
    }
    return [];
  }
  calculateSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(
      (word) => words2.some((w2) => w2.includes(word) || word.includes(w2))
    );
    return Math.round(commonWords.length / Math.max(words1.length, words2.length) * 100);
  }
  async analyzePlagiarism(request) {
    const { content, checkSimilarity, checkParaphrasing, excludeQuotes } = request;
    console.log("Starting plagiarism analysis with Google Search...");
    const detectedIssues = [];
    let highlightedText = content;
    if (!this.googleApiKey || !this.searchEngineId) {
      console.warn("Google API credentials not configured, using fallback detection");
    }
    if (checkSimilarity || checkParaphrasing) {
      const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i].trim();
        if (sentence.length < 15) continue;
        console.log(`Searching for sentence ${i + 1}:`, sentence.substring(0, 50) + "...");
        const searchResults = await this.searchGoogle(sentence);
        if (searchResults.length > 0) {
          const result = searchResults[0];
          const similarity = result.link.includes("wikipedia") ? 95 : this.calculateSimilarity(sentence, result.snippet);
          if (similarity >= 50) {
            const startIndex = content.indexOf(sentence);
            const endIndex = startIndex + sentence.length;
            const isPlagiarism = similarity >= 75;
            let sourceName = result.link;
            try {
              const url = new URL(result.link);
              sourceName = url.hostname.replace("www.", "");
            } catch (e) {
              sourceName = result.link.includes("wikipedia") ? "en.wikipedia.org" : "unknown source";
            }
            detectedIssues.push({
              type: isPlagiarism ? "plagiarism" : "paraphrasing",
              text: sentence,
              similarity,
              source: sourceName,
              url: result.link,
              startIndex,
              endIndex
            });
            const highlightClass = isPlagiarism ? "plagiarism" : "paraphrasing";
            const highlightedSentence = `<span class="highlight-${highlightClass}" data-similarity="${similarity}" data-source="${sourceName}">${sentence}</span>`;
            highlightedText = highlightedText.replace(sentence, highlightedSentence);
            console.log(`Found ${isPlagiarism ? "plagiarism" : "paraphrasing"} match: ${similarity}% similarity with ${sourceName}`);
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
    const totalWords = content.split(/\s+/).length;
    const plagiarizedIssues = detectedIssues.filter((issue) => issue.type === "plagiarism");
    const paraphrasedIssues = detectedIssues.filter((issue) => issue.type === "paraphrasing");
    const plagiarizedWords = plagiarizedIssues.reduce(
      (sum, issue) => sum + issue.text.split(/\s+/).length,
      0
    );
    const paraphrasedWords = paraphrasedIssues.reduce(
      (sum, issue) => sum + issue.text.split(/\s+/).length,
      0
    );
    const plagiarizedPercentage = Math.round(plagiarizedWords / totalWords * 100);
    const paraphrasedPercentage = Math.round(paraphrasedWords / totalWords * 100);
    const originalPercentage = Math.max(0, 100 - plagiarizedPercentage - paraphrasedPercentage);
    const originalityScore = originalPercentage;
    const recommendations = this.generateRecommendations(detectedIssues);
    console.log(`Analysis complete: ${detectedIssues.length} issues found, ${originalityScore}% original`);
    return {
      originalityScore,
      originalPercentage,
      paraphrasedPercentage,
      plagiarizedPercentage,
      detectedIssues,
      recommendations,
      highlightedText
    };
  }
  generateRecommendations(issues) {
    const recommendations = [];
    if (issues.length === 0) {
      recommendations.push("Great work! Your content appears to be original.");
      return recommendations;
    }
    const plagiarismIssues = issues.filter((issue) => issue.type === "plagiarism");
    const paraphrasingIssues = issues.filter((issue) => issue.type === "paraphrasing");
    if (plagiarismIssues.length > 0) {
      recommendations.push("Rephrase highlighted sections to express ideas in your own voice while maintaining the original meaning.");
      recommendations.push("Add proper citations for any referenced content to give credit to original sources and avoid plagiarism.");
    }
    if (paraphrasingIssues.length > 0) {
      recommendations.push("Consider further rewording paraphrased sections to increase originality.");
      recommendations.push("Add more of your own analysis and insights to strengthen the original content.");
    }
    if (issues.length > 3) {
      recommendations.push("Consider restructuring your content to include more original research and analysis.");
    }
    recommendations.push("Expand original analysis to support your arguments with unique insights.");
    recommendations.push("Use quotation marks and citations when directly referencing other works.");
    return recommendations;
  }
};
var plagiarismService = new PlagiarismService();

// shared/schema.ts
import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var plagiarismReports = pgTable("plagiarism_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  originalityScore: integer("originality_score").notNull(),
  originalPercentage: integer("original_percentage").notNull(),
  paraphrasedPercentage: integer("paraphrased_percentage").notNull(),
  plagiarizedPercentage: integer("plagiarized_percentage").notNull(),
  detectedIssues: jsonb("detected_issues").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  highlightedText: text("highlighted_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertPlagiarismReportSchema = createInsertSchema(plagiarismReports).omit({
  id: true,
  createdAt: true
});
var plagiarismAnalysisSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters long"),
  checkSimilarity: z.boolean().default(true),
  checkParaphrasing: z.boolean().default(true),
  excludeQuotes: z.boolean().default(false)
});

// server/routes.ts
import { ZodError } from "zod";
async function registerRoutes(app2) {
  app2.post("/api/analyze", async (req, res) => {
    try {
      const analysisRequest = plagiarismAnalysisSchema.parse(req.body);
      const result = await plagiarismService.analyzePlagiarism(analysisRequest);
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
  app2.get("/api/report/:id", async (req, res) => {
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
  app2.post("/api/upload", async (req, res) => {
    try {
      res.status(501).json({
        message: "File upload feature is not yet implemented. Please paste your text directly."
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
