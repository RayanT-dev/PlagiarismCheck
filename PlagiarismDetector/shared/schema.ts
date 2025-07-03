import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const plagiarismReports = pgTable("plagiarism_reports", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPlagiarismReportSchema = createInsertSchema(plagiarismReports).omit({
  id: true,
  createdAt: true,
});

export const plagiarismAnalysisSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters long"),
  checkSimilarity: z.boolean().default(true),
  checkParaphrasing: z.boolean().default(true),
  excludeQuotes: z.boolean().default(false),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PlagiarismReport = typeof plagiarismReports.$inferSelect;
export type InsertPlagiarismReport = z.infer<typeof insertPlagiarismReportSchema>;
export type PlagiarismAnalysisRequest = z.infer<typeof plagiarismAnalysisSchema>;
