import { Router } from "express";
import { AssessmentWeightController } from "./assessmentWeight.controller";
import { authenticate, authorize } from "../auth/auth.middleware";
import { checkAssessmentWeightAccess } from "./assessmentWeight.middleware";
import { validate } from "../../lib/validate";
import {
  assessmentWeightCreateSchema,
  assessmentWeightUpdateSchema,
  assessmentWeightParamsSchema,
} from "./assessmentWeight.schema";
import { Role } from "@prisma/client";

const router = Router();

// Protected routes
router.use(authenticate);

// Admin and teacher routes
router.post(
  "/",
  authorize([Role.ADMIN, Role.TEACHER]),
  validate(assessmentWeightCreateSchema),
  AssessmentWeightController.create
);

router.get("/", AssessmentWeightController.findAll);

router.get(
  "/:id",
  validate(assessmentWeightParamsSchema),
  AssessmentWeightController.findById
);

router.put(
  "/:id",
  validate(assessmentWeightParamsSchema),
  validate(assessmentWeightUpdateSchema),
  authorize([Role.ADMIN, Role.TEACHER]),
  checkAssessmentWeightAccess,
  AssessmentWeightController.update
);

router.delete(
  "/:id",
  validate(assessmentWeightParamsSchema),
  authorize([Role.ADMIN, Role.TEACHER]),
  checkAssessmentWeightAccess,
  AssessmentWeightController.delete
);

export { router as assessmentWeightRouter };
