import { db } from "./db";
import {
  reports,
  type InsertReport,
  type Report
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getReports(): Promise<Report[]>;
  getReport(id: number): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
}

export class DatabaseStorage implements IStorage {
  async getReports(): Promise<Report[]> {
    return await db.select().from(reports);
  }

  async getReport(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }
}

export const storage = new DatabaseStorage();
