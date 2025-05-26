import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticate } from "./auth.middleware";
import { validate } from "../../lib/validate";
import { registerSchema, loginSchema } from "./auth.schema";

export const authRouter = Router();

// Register a new user
authRouter.post("/register", validate(registerSchema), AuthController.register);

// Login
authRouter.post("/login", validate(loginSchema), AuthController.login);

// Get current user profile
authRouter.get("/profile", authenticate, AuthController.getProfile);
