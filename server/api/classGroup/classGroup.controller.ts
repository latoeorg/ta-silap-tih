import { Request, Response } from "express";
import {
  ClassGroupCreateInput,
  ClassGroupUpdateInput,
  ClassGroupParams,
  ClassGroupStudentsInput,
} from "./classGroup.schema";
import { ApiResponse } from "../../utils/api-response";
import { ClassGroupService } from "./classGroup.service";

export class ClassGroupController {
  static async create(
    req: Request<{}, {}, ClassGroupCreateInput>,
    res: Response
  ) {
    const classGroup = await ClassGroupService.create(req.body);

    ApiResponse.success({
      res,
      data: classGroup,
      message: "Class group created successfully",
    });
  }

  static async findAll(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";

    const result = await ClassGroupService.findAll(page, limit, {
      search,
    });

    ApiResponse.success({
      res,
      data: result.classGroups,
      pagination: {
        total_items: result.meta.total,
        page: result.meta.page,
        page_size: result.meta.limit,
        total_pages: Math.ceil(result.meta.total / result.meta.limit),
      },
      message: "Users retrieved successfully",
    });
  }

  static async findById(req: Request<ClassGroupParams>, res: Response) {
    const classGroup = await ClassGroupService.findById(req.params.id);

    ApiResponse.success({
      res,
      data: classGroup,
      message: "Class group retrieved successfully",
    });
  }

  static async update(
    req: Request<ClassGroupParams, {}, ClassGroupUpdateInput>,
    res: Response
  ) {
    const classGroup = await ClassGroupService.update(req.params.id, req.body);

    ApiResponse.success({
      res,
      data: classGroup,
      message: "Class group updated successfully",
    });
  }

  static async delete(req: Request<ClassGroupParams>, res: Response) {
    await ClassGroupService.delete(req.params.id);

    ApiResponse.success({
      res,
      message: "Class group deleted successfully",
    });
  }

  static async getStudentIdsByClassGroupId(
    req: Request<ClassGroupParams>,
    res: Response
  ) {
    const studentIds = await ClassGroupService.getStudentIdsByClassGroupId({
      class_group_id: req.params.id,
    });

    ApiResponse.success({
      res,
      data: studentIds,
      message: "Class group student IDs retrieved successfully",
    });
  }

  static async updateStudents(
    req: Request<ClassGroupParams, {}, ClassGroupStudentsInput>,
    res: Response
  ) {
    const classGroup = await ClassGroupService.updateStudents(
      req.params.id,
      req.body
    );

    ApiResponse.success({
      res,
      data: classGroup,
      message: "Class group students updated successfully",
    });
  }

  static async deleteStudents(
    req: Request<ClassGroupParams, {}, ClassGroupStudentsInput>,
    res: Response
  ) {
    const classGroup = await ClassGroupService.deleteStudents(
      req.params.id,
      req.body
    );

    ApiResponse.success({
      res,
      data: classGroup,
      message: "Class group students updated successfully",
    });
  }
}
