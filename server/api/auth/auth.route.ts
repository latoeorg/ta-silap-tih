import { Router } from "express";
import { AuthMiddlware } from "./auth.middleware";
import { AuthController } from "./auth.controller";

export const AuthRouter = Router()
  .post("/register", AuthMiddlware.registerMiddleware, AuthController.register)
  .post("/login", AuthMiddlware.loginMiddleware, AuthController.login);
