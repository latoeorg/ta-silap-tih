import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { authRouter } from "../api/auth/auth.route";
import { authenticate } from "../api/auth/auth.middleware";
import { ProtectedRoutes } from "../routes/protected.route";

export default class App {
  public express: Application;
  private apiPrefix = "/api";

  constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  private middlewares(): void {
    // Basic middlewares
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cors());
    this.express.use(helmet());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.express.use(limiter);
  }

  private routes() {
    // Health check route
    this.express.get("/", (req, res) => {
      res.status(200).json({ status: "ok" });
    });

    // API routes - Fix: Ensure all route paths are properly formatted
    this.express.use(`${this.apiPrefix}`, authRouter);
    this.express.use(`${this.apiPrefix}`, authenticate, ProtectedRoutes);
  }

  private errorHandling(): void {
    this.express.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).json({
          status: "error",
          message: err.message || "Internal Server Error",
        });
      }
    );
  }
}
