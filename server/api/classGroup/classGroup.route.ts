import { Router } from "express";
import { ClassGroupController } from "./classGroup.controller";
import { authenticate, authorize } from "../auth/auth.middleware";
import { checkClassGroupAccess } from "./classGroup.middleware";
import { validate } from "../../lib/validate";
import {
  classGroupCreateSchema,
  classGroupUpdateSchema,
  classGroupParamsSchema,
  classGroupStudentsSchema,
} from "./classGroup.schema";
import { Role } from "@prisma/client";

const router = Router();

// Protected routes
router.use(authenticate);

// Admin only routes
router.post(
  "/",
  authorize([Role.ADMIN]),
  validate(classGroupCreateSchema),
  ClassGroupController.create
);

router.delete(
  "/:id",
  validate(classGroupParamsSchema),
  authorize([Role.ADMIN]),
  ClassGroupController.delete
);

// Routes for admins and homeroom teachers
router.get(
  "/",
  authorize([Role.ADMIN, Role.TEACHER]),
  ClassGroupController.findAll
);

router.get(
  "/:id",
  // validate(classGroupParamsSchema),
  authorize([Role.ADMIN, Role.TEACHER, Role.STUDENT]),
  checkClassGroupAccess,
  ClassGroupController.findById
);

router.put(
  "/:id",
  validate(classGroupUpdateSchema),
  authorize([Role.ADMIN]),
  checkClassGroupAccess,
  ClassGroupController.update
);

router.put(
  "/:id/students",
  validate(classGroupStudentsSchema),
  authorize([Role.ADMIN]),
  checkClassGroupAccess,
  ClassGroupController.updateStudents
);

router.delete(
  "/:id/students",
  validate(classGroupStudentsSchema),
  authorize([Role.ADMIN]),
  checkClassGroupAccess,
  ClassGroupController.deleteStudents
);

export { router as classGroupRouter };
