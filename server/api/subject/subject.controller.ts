import { Request, Response } from "express";
import {
  SubjectCreateInput,
  SubjectUpdateInput,
  SubjectParams,
} from "./subject.schema";
import { SubjectService } from "./subject.service";
import { ApiResponse } from "../../utils/api-response";

export class SubjectController {
  static async create(req: Request<{}, {}, SubjectCreateInput>, res: Response) {
    const subject = await SubjectService.create(req.body);

    ApiResponse.success({
      res,
      data: subject,
      message: "Subject created successfully",
    });
  }

  static async findAll(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await SubjectService.findAll(page, limit);

    ApiResponse.success({
      res,
      data: result.subjects,
      meta: result.meta,
      message: "Subjects retrieved successfully",
    });
  }

  static async findById(req: Request<SubjectParams>, res: Response) {
    const subject = await SubjectService.findById(req.params.id);

    ApiResponse.success({
      res,
      data: subject,
      message: "Subject retrieved successfully",
    });
  }

  static async update(
    req: Request<SubjectParams, {}, SubjectUpdateInput>,
    res: Response
  ) {
    const subject = await SubjectService.update(req.params.id, req.body);

    ApiResponse.success({
      res,
      data: subject,
      message: "Subject updated successfully",
    });
  }

  static async delete(req: Request<SubjectParams>, res: Response) {
    await SubjectService.delete(req.params.id);

    ApiResponse.success({
      res,
      data: null,
      message: "Subject deleted successfully",
    });
  }
}
