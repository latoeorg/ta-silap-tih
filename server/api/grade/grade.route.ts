import { Router } from "express";
import { GradeController } from "./grade.controller";
import { authenticate } from "../auth/auth.middleware";

const gradeRouter = Router();

// Apply authentication middleware to all grade routes
gradeRouter.use(authenticate);

// Grade routes
gradeRouter.post("/", GradeController.createGrade);
gradeRouter.post("/batch", GradeController.createBatchGrades);
gradeRouter.get("/", GradeController.getGrades);
gradeRouter.get("/component", GradeController.getGradeComponents);
gradeRouter.put("/component", GradeController.updateGradeComponent);
gradeRouter.get("/:userId/:courseId/:examType", GradeController.getGradeByKey);
gradeRouter.put("/:userId/:courseId/:examType", GradeController.updateGrade);
gradeRouter.delete("/:userId/:courseId/:examType", GradeController.deleteGrade);
gradeRouter.get(
  "/student/:userId/teacher/:teacherId",
  GradeController.getGradeEachStudent
);
export default gradeRouter;
