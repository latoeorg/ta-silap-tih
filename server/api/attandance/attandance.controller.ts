import { Request, Response } from "express";
import { AttendanceService } from "./attandance.service";
import { ApiResponse } from "../../utils/api-response";
import fs from "fs";

export class AttendanceController {
  /**
   * Create a new attendance record
   */
  static async create(req: Request, res: Response) {
    try {
      const attendance = await AttendanceService.create(req.body);

      ApiResponse.success({
        res,
        data: attendance,
        message: "Attendance record created successfully",
      });
    } catch (error: any) {
      ApiResponse.error({
        res,
        message:
          JSON.stringify(error.message) || "Failed to create attendance record",
      });
    }
  }

  /**
   * Create multiple attendance records in batch
   */
  static async createBatch(req: Request, res: Response) {
    try {
      const result = await AttendanceService.createBatch(req.body);

      ApiResponse.success({
        res,
        data: result,
        message: `Processed ${result.success} attendance records successfully, ${result.failed} failed`,
      });
    } catch (error: any) {
      ApiResponse.error({
        res,
        message:
          JSON.stringify(error.message) ||
          "Failed to process attendance records",
      });
    }
  }

  /**
   * Find all attendance records with optional filtering
   */
  static async findAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const courseId = req.query.course_id as string;
      const userId = req.query.userId as string;
      const date = req.query.date as string;
      const startDate = req.query.start_date as string;
      const endDate = req.query.end_date as string;
      const status = req.query.status as any;

      const result = await AttendanceService.findAll(page, limit, {
        courseId,
        userId,
        date,
        startDate,
        endDate,
        status,
      });

      ApiResponse.success({
        res,
        data: result.attendances,
        meta: result.meta,
        pagination: {
          total_items: result.meta.total,
          page: page,
          page_size: limit,
          total_pages: Math.ceil(result.meta.total / limit),
        },
        message: "Attendance records retrieved successfully",
      });
    } catch (error: any) {
      ApiResponse.error({
        res,
        message:
          JSON.stringify(error.message) ||
          "Failed to retrieve attendance records",
      });
    }
  }

  /**
   * Find attendance records for a specific course and date
   */
  static async findByCourseAndDate(req: Request, res: Response) {
    try {
      const courseId = req.params.courseId;
      const date = req.query.date as string;

      if (!courseId || !date) {
        ApiResponse.error({
          res,
          message: "Course ID and date are required",
          statusCode: 400,
        });
        return;
      }

      const result = await AttendanceService.findByCourseAndDate(
        courseId,
        date
      );

      ApiResponse.success({
        res,
        data: result,
        message: "Attendance records retrieved successfully",
      });
    } catch (error: any) {
      ApiResponse.error({
        res,
        message:
          JSON.stringify(error.message) ||
          "Failed to retrieve attendance records",
      });
    }
  }

  /**
   * Find attendance record by user and course
   */
  static async findByUserAndCourse(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const courseId = req.params.courseId;
      const date = req.query.date as string;

      if (!userId || !courseId || !date) {
        ApiResponse.error({
          res,
          message: "User ID, course ID, and date are required",
          statusCode: 400,
        });
        return;
      }

      const attendance = await AttendanceService.findByUserAndCourse(
        userId,
        courseId,
        date
      );

      ApiResponse.success({
        res,
        data: attendance,
        message: "Attendance record retrieved successfully",
      });
    } catch (error: any) {
      ApiResponse.error({
        res,
        message:
          JSON.stringify(error.message) ||
          "Failed to retrieve attendance record",
      });
    }
  }

  /**
   * Update attendance record
   */
  static async update(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const courseId = req.params.courseId;
      const { date, status } = req.body;

      if (!userId || !courseId || !date) {
        ApiResponse.error({
          res,
          message: "User ID, course ID, and date are required",
          statusCode: 400,
        });
        return;
      }

      const attendance = await AttendanceService.update(
        userId,
        courseId,
        date,
        { status }
      );

      ApiResponse.success({
        res,
        data: attendance,
        message: "Attendance record updated successfully",
      });
    } catch (error: any) {
      ApiResponse.error({
        res,
        message:
          JSON.stringify(error.message) || "Failed to update attendance record",
      });
    }
  }

  /**
   * Delete attendance record
   */
  static async delete(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const courseId = req.params.courseId;
      const date = req.query.date as string;

      if (!userId || !courseId || !date) {
        ApiResponse.error({
          res,
          message: "User ID, course ID, and date are required",
          statusCode: 400,
        });
        return;
      }

      await AttendanceService.delete(userId, courseId, date);

      ApiResponse.success({
        res,
        data: null,
        message: "Attendance record deleted successfully",
      });
    } catch (error: any) {
      ApiResponse.error({
        res,
        message:
          JSON.stringify(error.message) || "Failed to delete attendance record",
      });
    }
  }
  /**
   * Get attendance summary for a student in a course
   */
  static async getStudentCourseSummary(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const courseId = req.params.courseId;

      if (!userId || !courseId) {
        ApiResponse.error({
          res,
          message: "User ID and course ID are required",
          statusCode: 400,
        });
        return;
      }

      const summary = await AttendanceService.getStudentCourseSummary(
        userId,
        courseId
      );

      ApiResponse.success({
        res,
        data: summary,
        message: "Attendance summary retrieved successfully",
      });
    } catch (error: any) {
      ApiResponse.error({
        res,
        message:
          JSON.stringify(error.message) ||
          "Failed to retrieve attendance summary",
      });
    }
  }
}
