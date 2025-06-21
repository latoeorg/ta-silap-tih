import { Request, Response } from "express";
import { ExamType } from "@prisma/client";
import { GradeService } from "./grade.service";
import { GradeComponentService } from "./gradeComponent.service";
import { ApiResponse } from "../../utils/api-response";

export class GradeController {
  /**
   * Create a new grade
   */
  static async createGrade(req: Request, res: Response) {
    try {
      const { userId, courseId, examType, totalScore, components } = req.body;

      const grade = await GradeService.create({
        userId,
        courseId,
        examType,
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
  static async createBatchGrades(req: Request, res: Response) {
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
  static async getGrades(req: Request, res: Response) {
    try {
      const {
        courseId,
        userId,
        examType,
        page = "1",
        limit = "10",
        include,
      } = req.query;

      const includeComponents = include === "components";

      const result = await GradeService.findAll(
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        {
          courseId: courseId as string,
          userId: userId as string,
          examType: examType as ExamType,
        },
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
   * Get a specific grade by student, course and exam type
   */
  static async getGradeByKey(req: Request, res: Response) {
    try {
      const { userId, courseId, examType } = req.params;
      const { include } = req.query;

      const includeComponents = include === "components";

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
