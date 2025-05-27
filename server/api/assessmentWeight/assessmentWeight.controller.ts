import { Request, Response } from "express";
import {
  AssessmentWeightCreateInput,
  AssessmentWeightUpdateInput,
  AssessmentWeightParams,
} from "./assessmentWeight.schema";
import { AssessmentWeightService } from "./assessmentWeight.service";
import { ApiResponse } from "../../utils/api-response";

export class AssessmentWeightController {
  static async create(
    req: Request<{}, {}, AssessmentWeightCreateInput>,
    res: Response
  ) {
    const assessmentWeight = await AssessmentWeightService.create(
      req.user.userId,
      req.body
    );

    ApiResponse.success({
      res,
      data: assessmentWeight,
      message: "Assessment weight created successfully",
    });
  }

  static async findAll(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const subjectId = req.query.subjectId as string | undefined;
    const result = await AssessmentWeightService.findAll(
      page,
      limit,
      subjectId
    );

    ApiResponse.success({
      res,
      data: result.assessmentWeights,
      meta: result.meta,
      message: "Assessment weights retrieved successfully",
    });
  }

  static async findById(req: Request<AssessmentWeightParams>, res: Response) {
    const assessmentWeight = await AssessmentWeightService.findById(
      req.params.id
    );

    ApiResponse.success({
      res,
      data: assessmentWeight,
      message: "Assessment weight retrieved successfully",
    });
  }

  static async update(
    req: Request<AssessmentWeightParams, {}, AssessmentWeightUpdateInput>,
    res: Response
  ) {
    const assessmentWeight = await AssessmentWeightService.update(
      req.params.id,
      req.body
    );

    ApiResponse.success({
      res,
      data: assessmentWeight,
      message: "Assessment weight updated successfully",
    });
  }

  static async delete(req: Request<AssessmentWeightParams>, res: Response) {
    await AssessmentWeightService.delete(req.params.id);

    ApiResponse.success({
      res,
      message: "Assessment weight deleted successfully",
    });
  }
}
