import { Request, Response } from "express";
import { ExamType } from "@prisma/client";
import { GradeService } from "./grade.service";
import { GradeComponentService } from "./gradeComponent.service";
import { ApiResponse } from "../../utils/api-response";

export class GradeController {
  /**
   * Create a new grade
   */
  static async createGrade(req: Request, res: Response): Promise<void> {
    try {
      const { userId, course_id, exam_type, totalScore, components } = req.body;

      const grade = await GradeService.create({
        userId,
        courseId: course_id,
        examType: exam_type,
        totalScore,
        components,
      });

      ApiResponse.success({
        res,
        data: grade,
        message: "Grade created successfully",
      });
    } catch (error) {
      console.error("Create grade error:", error);
      ApiResponse.error({
        res,
        message: JSON.stringify(error) || "Failed to create grade",
        error,
      });
    }
  }

  /**
   * Create multiple grades in batch
   */
  static async createBatchGrades(req: Request, res: Response): Promise<void> {
    try {
      const { grades } = req.body;

      const result = await GradeService.createBatch({ grades });

      ApiResponse.success({
        res,
        data: result,
        message: `Processed ${result.success + result.failed} grades: ${
          result.success
        } successful, ${result.failed} failed`,
      });
    } catch (error) {
      console.error("Create batch grades error:", error);
      ApiResponse.error({
        res,
        message: "Failed to process batch grades",
        error,
      });
    }
  }

  /**
   * Get grades with optional filtering
   */
  static async getGrades(req: Request, res: Response): Promise<void> {
    try {
      const {
        course_id,
        userId,
        examType,
        page = "1",
        limit = "10",
        include,
      } = req.query;
      const user = req.user;
      const courseId = course_id as string | undefined;

      console.log("courseId", courseId, req.query);

      const includeComponents = include === "components";

      // Role-based filtering
      let filters: any = {
        courseId: courseId as string,
        examType: examType as ExamType,
      };

      if (user.role === "STUDENT") {
        // Students can only see their own grades
        filters.userId = user.userId;
      } else if (user.role === "TEACHER") {
        // Teachers can see grades for courses they teach
        if (courseId) {
          // Verify teacher owns this course
          const course = await GradeService.verifyCourseAccess(
            courseId as string,
            user.userId
          );
          if (!course) {
            throw new Error("Unauthorized: You do not teach this course");
          }
        }
        // If userId is specified, use it; otherwise get all students
        if (userId) {
          filters.userId = userId as string;
        }
      } else {
        // Admins can see all grades with any filter
        if (userId) {
          filters.userId = userId as string;
        }
      }

      console.log("filters", filters);

      const result = await GradeService.findAll(
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        filters,
        includeComponents
      );

      ApiResponse.success({
        res,
        data: result.grades,
        pagination: {
          total_items: result.meta.total,
          page: result.meta.page,
          page_size: result.meta.limit,
          total_pages: Math.ceil(result.meta.total / result.meta.limit),
        },
        message: "Grades retrieved successfully",
      });
    } catch (error) {
      console.error("Get grades error:", error);
      ApiResponse.error({
        res,
        message: "Failed to retrieve grades",
        error,
      });
    }
  }

  /**
   * Get student's own grades (for student role)
   */
  static async getMyGrades(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;
      const { course_id, examType, page = "1", limit = "10" } = req.query;

      // Only students can access this endpoint
      if (user.role !== "STUDENT") {
        ApiResponse.error({
          res,
          message: "Unauthorized: This endpoint is only for students",
          statusCode: 403,
        });
        return;
      }

      const filters: any = {
        userId: user.userId, // Always filter by current user
      };

      if (course_id) {
        filters.courseId = course_id as string;
      }

      if (examType) {
        filters.examType = examType as ExamType;
      }

      const result = await GradeService.findStudentGrades(
        user.userId,
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        filters
      );

      ApiResponse.success({
        res,
        data: result.grades,
        pagination: {
          total_items: result.meta.total,
          page: result.meta.page,
          page_size: result.meta.limit,
          total_pages: Math.ceil(result.meta.total / result.meta.limit),
        },
        message: "Student grades retrieved successfully",
      });
    } catch (error) {
      console.error("Get student grades error:", error);
      ApiResponse.error({
        res,
        message: "Failed to retrieve student grades",
        error,
      });
    }
  }

  /**
   * Get a specific grade by student, course and exam type
   */
  static async getGradeByKey(req: Request, res: Response): Promise<void> {
    try {
      const { userId, courseId, examType } = req.params;
      const { include } = req.query;
      const user = req.user;

      const includeComponents = include === "components";

      // Role-based access control
      if (user.role === "STUDENT") {
        // Students can only access their own grades
        if (userId !== user.userId) {
          ApiResponse.error({
            res,
            message: "Unauthorized: You can only access your own grades",
            statusCode: 403,
          });
          return;
        }
      } else if (user.role === "TEACHER") {
        // Teachers can only access grades for courses they teach
        const course = await GradeService.verifyCourseAccess(
          courseId,
          user.userId
        );
        if (!course) {
          ApiResponse.error({
            res,
            message: "Unauthorized: You do not teach this course",
            statusCode: 403,
          });
          return;
        }
      }
      // Admins can access any grade

      const grade = await GradeService.findByKey(
        userId,
        courseId,
        examType as ExamType,
        includeComponents
      );

      ApiResponse.success({
        res,
        data: grade,
        message: "Grade retrieved successfully",
      });
    } catch (error) {
      console.error("Get grade error:", error);
      ApiResponse.error({
        res,
        message: JSON.stringify(error) || "Failed to retrieve grade",
        error,
      });
    }
  }

  /**
   * Update a grade
   */
  static async updateGrade(req: Request, res: Response) {
    try {
      const { userId, courseId, examType } = req.params;
      const { totalScore, components } = req.body;

      const grade = await GradeService.update(
        userId,
        courseId,
        examType as ExamType,
        {
          totalScore,
          components,
        }
      );

      ApiResponse.success({
        res,
        data: grade,
        message: "Grade updated successfully",
      });
    } catch (error) {
      console.error("Update grade error:", error);
      ApiResponse.error({
        res,
        message: JSON.stringify(error) || "Failed to update grade",
        error,
      });
    }
  }

  /**
   * Delete a grade
   */
  static async deleteGrade(req: Request, res: Response) {
    try {
      const { userId, courseId, examType } = req.params;

      await GradeService.delete(userId, courseId, examType as ExamType);

      ApiResponse.success({
        res,
        message: "Grade deleted successfully",
      });
    } catch (error) {
      console.error("Delete grade error:", error);
      ApiResponse.error({
        res,
        message: JSON.stringify(error) || "Failed to delete grade",
        error,
      });
    }
  }

  /**
   * Get component templates for a specific exam type
   */
  static async getGradeComponents(req: Request, res: Response) {
    try {
      const { examType } = req.query;

      const components = await GradeComponentService.getComponentTemplates(
        examType as ExamType
      );

      ApiResponse.success({
        res,
        data: components,
        message: "Grade components retrieved successfully",
      });
    } catch (error) {
      console.error("Get grade components error:", error);
      ApiResponse.error({
        res,
        message: JSON.stringify(error) || "Failed to retrieve grade components",
        error,
      });
    }
  }

  /**
   * Update a grade component score
   */
  static async updateGradeComponent(req: Request, res: Response) {
    try {
      const { userId, courseId, examType, componentIndex, score } = req.body;

      if (
        !userId ||
        !courseId ||
        !examType ||
        componentIndex === undefined ||
        score === undefined
      ) {
        ApiResponse.error({
          res,
          message:
            "userId, courseId, examType, componentIndex, and score are required",
          statusCode: 400,
        });
        return;
      }

      const result = await GradeService.updateGradeComponent(
        userId,
        courseId,
        examType as ExamType,
        componentIndex,
        score
      );

      ApiResponse.success({
        res,
        data: result,
        message: "Grade component updated successfully",
      });
    } catch (error) {
      console.error("Update grade component error:", error);
      ApiResponse.error({
        res,
        message: JSON.stringify(error) || "Failed to update grade component",
        error,
      });
    }
  }

  static async getGradeEachStudent(req: Request, res: Response) {
    const { userId, teacherId } = req.params;
    console.log(userId, teacherId);
    try {
      const grades = await GradeService.getGradeEachStudnet({
        userId: userId as string,
        teacherId: teacherId as string,
      });

      ApiResponse.success({
        res,
        data: grades,
        message: "Grades retrieved successfully",
      });
    } catch (error) {
      console.error("Get each student grade error:", error);
      ApiResponse.error({
        res,
        message:
          JSON.stringify(error) || "Failed to retrieve each student grade",
        error,
      });
    }
  }
}
