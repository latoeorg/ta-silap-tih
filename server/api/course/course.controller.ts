import { Request, Response } from "express";
import { CourseService } from "./course.service";
import { ApiResponse } from "../../utils/api-response";

export class CourseController {
  /**
   * Create a new course
   */
  static async createCourse(req: Request, res: Response) {
    try {
      const { name, teacherId, subjectId, classGroupId } = req.body;

      const course = await CourseService.create({
        name,
        teacherId,
        subjectId,
        classGroupId,
      });

      ApiResponse.success({
        res,
        data: course,
        message: "Course created successfully",
      });
    } catch (error) {
      console.error("Create course error:", error);
      ApiResponse.error({
        res,
        message: JSON.stringify(error) || "Failed to create course",
        error,
      });
    }
  }

  /**
   * Get all courses with optional filtering
   */
  static async getAllCourses(req: Request, res: Response) {
    try {
      const { subjectId, page = "1", limit = "10" } = req.query;
      const user = req.user;

      let result;

      console.log("user", user);

      if (user.role === "STUDENT") {
        // Students can only see courses they are enrolled in
        result = await CourseService.findStudentCourses(
          user.userId,
          parseInt(page as string, 10),
          parseInt(limit as string, 10),
          subjectId as string
        );
      } else if (user.role === "TEACHER") {
        // Teachers can see courses they teach
        result = await CourseService.findTeacherCourses(
          user.userId,
          parseInt(page as string, 10),
          parseInt(limit as string, 10),
          subjectId as string
        );
      } else {
        // Admins can see all courses
        result = await CourseService.findAll(
          parseInt(page as string, 10),
          parseInt(limit as string, 10),
          subjectId as string
        );
      }

      ApiResponse.success({
        res,
        data: result.courses,
        pagination: {
          total_items: result.meta.total,
          page: result.meta.page,
          page_size: result.meta.limit,
          total_pages: Math.ceil(result.meta.total / result.meta.limit),
        },
        message: "Courses retrieved successfully",
      });
    } catch (error) {
      console.error("Get courses error:", error);
      ApiResponse.error({
        res,
        message: "Failed to retrieve courses",
        error,
      });
    }
  }

  /**
   * Get course by ID with optional includes
   */
  static async getCourseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const include = req.query.include as string;
      const user = req.user;

      // Parse include parameter (comma-separated list)
      let includeArray: string[] | undefined;
      if (include) {
        includeArray = include.split(",");
      }

      const course = await CourseService.findById(id, includeArray);

      // Check if student is authorized to view this course
      if (user.role === "STUDENT") {
        const isEnrolled = course.students?.some(
          (student: any) => student.id === user.userId
        );
        if (!isEnrolled) {
          throw new Error("Unauthorized: You are not enrolled in this course");
        }
      }

      // Check if teacher is authorized to view this course
      if (user.role === "TEACHER" && course.teacherId !== user.userId) {
        throw new Error("Unauthorized: You are not the teacher of this course");
      }

      ApiResponse.success({
        res,
        data: course,
        message: "Course retrieved successfully",
      });
    } catch (error) {
      console.error("Get course error:", error);
      ApiResponse.error({
        res,
        message: JSON.stringify(error) || "Failed to retrieve course",
        error,
      });
    }
  }

  /**
   * Update course by ID
   */
  static async updateCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, teacherId, subjectId, classGroupId } = req.body;

      const course = await CourseService.update(id, {
        name,
        teacherId,
        subjectId,
        classGroupId,
      });

      ApiResponse.success({
        res,
        data: course,
        message: "Course updated successfully",
      });
    } catch (error) {
      console.error("Update course error:", error);
      ApiResponse.error({
        res,
        message: JSON.stringify(error) || "Failed to update course",
        error,
      });
    }
  }

  /**
   * Delete course by ID
   */
  static async deleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await CourseService.delete(id);

      ApiResponse.success({
        res,
        message: "Course deleted successfully",
      });
    } catch (error) {
      console.error("Delete course error:", error);
      ApiResponse.error({
        res,
        message: JSON.stringify(error) || "Failed to delete course",
        error,
      });
    }
  }

  /**
   * Update students enrolled in a course
   */
  static async updateCourseStudents(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { studentIds } = req.body;

      const course = await CourseService.updateStudents(id, { studentIds });

      ApiResponse.success({
        res,
        data: course,
        message: "Course students updated successfully",
      });
    } catch (error) {
      console.error("Update course students error:", error);
      ApiResponse.error({
        res,
        message: JSON.stringify(error) || "Failed to update course students",
        error,
      });
    }
  }
}
