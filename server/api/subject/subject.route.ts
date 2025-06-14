import { Router } from "express";
import { SubjectController } from "./subject.controller";
import { authenticate, authorize } from "../auth/auth.middleware";
import { validate } from "../../lib/validate";
import { subjectCreateSchema, subjectUpdateSchema } from "./subject.schema";
import { Role } from "@prisma/client";

const router = Router();

// Protected routes
router.use(authenticate);

// Admin only routes
router.post(
  "/",
  authorize(Role.ADMIN),
  validate(subjectCreateSchema),
  SubjectController.create
);

router.put(
  "/:id",
  validate(subjectUpdateSchema),
  authorize(Role.ADMIN),
  SubjectController.update
);

router.delete("/:id", authorize(Role.ADMIN), SubjectController.delete);

// Routes for all authenticated users
router.get("/", SubjectController.findAll);

router.get("/:id", SubjectController.findById);

export { router as subjectRouter };
