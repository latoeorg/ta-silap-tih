import { Router } from "express";
import { CourseController } from "./course.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

// Apply authentication middleware to all course routes
router.use(authenticate);

// Course CRUD routes
router.post("/", CourseController.createCourse);
router.get("/", CourseController.getAllCourses);
router.get("/:id", CourseController.getCourseById);
router.put("/:id", CourseController.updateCourse);
router.delete("/:id", CourseController.deleteCourse);

// Course students management route
router.put("/:id/students", CourseController.updateCourseStudents);

export default router;
