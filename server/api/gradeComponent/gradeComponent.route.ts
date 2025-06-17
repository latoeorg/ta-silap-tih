import { Router } from "express";
import { GradeComponentController } from "./gradeComponent.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

// Apply authentication middleware
router.use(authenticate);

// Grade component routes
router.get("/", GradeComponentController.getComponents);
router.post("/define", GradeComponentController.defineComponents);

export default router;