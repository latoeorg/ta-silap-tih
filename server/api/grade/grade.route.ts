import { Router } from "express";
import { GradeController } from "./grade.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

// Apply authentication middleware to all grade routes
router.use(authenticate);

// Grade routes
router.post("/", GradeController.createGrade);
router.post("/batch", GradeController.createBatchGrades);
router.get("/", GradeController.getGrades);
router.get("/components", GradeController.getGradeComponents);
router.get("/:userId/:courseId/:examType", GradeController.getGradeByKey);
router.put("/:userId/:courseId/:examType", GradeController.updateGrade);
router.delete("/:userId/:courseId/:examType", GradeController.deleteGrade);

export default router;
