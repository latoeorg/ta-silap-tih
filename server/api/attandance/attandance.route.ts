import { Router } from "express";
import { AttendanceController } from "./attandance.controller";
import { AttendanceMiddleware } from "./attandance.middleware";

const router = Router();

// Route for creating a new attendance record
router.post(
  "/",
  AttendanceMiddleware.validateCreate,
  AttendanceController.create
);

// Route for creating multiple attendance records in batch
router.post(
  "/batch",
  AttendanceMiddleware.validateBatch,
  AttendanceController.createBatch
);

// Route for getting all attendance records with filtering
router.get("/", AttendanceController.findAll);

// Route for getting attendance records for a specific course and date
router.get("/course/:courseId", AttendanceController.findByCourseAndDate);

// Route for getting attendance record for a specific student in a course
router.get(
  "/student/:userId/course/:courseId",
  AttendanceController.findByUserAndCourse
);

// Route for getting attendance summary for a student in a course
router.get(
  "/summary/student/:userId/course/:courseId",
  AttendanceController.getStudentCourseSummary
);

// Route for updating an attendance record
router.put(
  "/:userId/:courseId",
  AttendanceMiddleware.validateUpdate,
  AttendanceController.update
);

// Route for deleting an attendance record
router.delete("/:userId/:courseId", AttendanceController.delete);

export default router;
