import { users, plagiarismReports, type User, type InsertUser, type PlagiarismReport, type InsertPlagiarismReport } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPlagiarismReport(report: InsertPlagiarismReport): Promise<PlagiarismReport>;
  getPlagiarismReport(id: number): Promise<PlagiarismReport | undefined>;
  getUserReports(userId: number): Promise<PlagiarismReport[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private reports: Map<number, PlagiarismReport>;
  private currentUserId: number;
  private currentReportId: number;

  constructor() {
    this.users = new Map();
    this.reports = new Map();
    this.currentUserId = 1;
    this.currentReportId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPlagiarismReport(insertReport: InsertPlagiarismReport): Promise<PlagiarismReport> {
    const id = this.currentReportId++;
    const report: PlagiarismReport = { 
      ...insertReport, 
      userId: insertReport.userId || null,
      id, 
      createdAt: new Date()
    };
    this.reports.set(id, report);
    return report;
  }

  async getPlagiarismReport(id: number): Promise<PlagiarismReport | undefined> {
    return this.reports.get(id);
  }

  async getUserReports(userId: number): Promise<PlagiarismReport[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.userId === userId
    );
  }
}

export const storage = new MemStorage();
