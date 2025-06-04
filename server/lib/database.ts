import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

class DatabaseService {
  private static instance: DatabaseService;
  public prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: [
        { emit: "event", level: "query" },
        { emit: "event", level: "error" },
        { emit: "event", level: "info" },
        { emit: "event", level: "warn" },
      ],
    });

    // Log database queries in development
    // if (process.env.NODE_ENV === "development") {
    //   this.prisma.$on("query", (e) => {
    //     logger.debug(`Query: ${e.query}`);
    //     logger.debug(`Duration: ${e.duration}ms`);
    //   });
    // }

    // this.prisma.$on("error", (e) => {
    //   logger.error("Database error:", e);
    // });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info("Database connected successfully");
    } catch (error) {
      logger.error("Database connection failed:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info("Database disconnected successfully");
    } catch (error) {
      logger.error("Database disconnection failed:", error);
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error("Database health check failed:", error);
      return false;
    }
  }
}

export const database = DatabaseService.getInstance();
export const prisma = database.prisma;
