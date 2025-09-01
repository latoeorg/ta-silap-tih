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
router.get("/component", GradeController.getGradeComponents);
router.put("/component", GradeController.updateGradeComponent);
router.get("/:userId/:courseId/:examType", GradeController.getGradeByKey);
router.put("/:userId/:courseId/:examType", GradeController.updateGrade);
router.delete("/:userId/:courseId/:examType", GradeController.deleteGrade);
router.get(
  "/student/:userId/teacher/:teacherId",
  GradeController.getGradeEachStudent
);
export default router;
