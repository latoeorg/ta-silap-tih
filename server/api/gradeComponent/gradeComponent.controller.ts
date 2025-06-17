import { Request, Response } from "express";
import { ExamType } from "@prisma/client";
import { GradeComponentService } from "./gradeComponent.service";
import { ApiResponse } from "../../utils/api-response";

export class GradeComponentController {
  /**
   * Get component templates for a specific exam type
   */
  static async getComponents(req: Request, res: Response) {
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
   * Define component templates for an exam type
   */
  static async defineComponents(req: Request, res: Response) {
    try {
      const { examType, components } = req.body;

      const savedComponents = await GradeComponentService.defineComponents({
        examType: examType as ExamType,
        components,
      });

      ApiResponse.success({
        res,
        data: savedComponents,
        message: "Grade components saved successfully",
      });
    } catch (error) {
      console.error("Define grade components error:", error);
      ApiResponse.error({
        res,
        message: JSON.stringify(error) || "Failed to save grade components",
        error,
      });
    }
  }
}
