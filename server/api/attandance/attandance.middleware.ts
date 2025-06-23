import { Request, Response, NextFunction } from "express";
import {
  attendanceCreateSchema,
  attendanceBatchSchema,
  attendanceUpdateSchema,
} from "./attandance.schema";
import { ApiResponse } from "../../utils/api-response";

export class AttendanceMiddleware {
  static validateCreate(req: Request, res: Response, next: NextFunction) {
    try {
      attendanceCreateSchema.parse(req.body);
      next();
    } catch (error) {
      ApiResponse.error({
        res,
        message: "Validation error",
        statusCode: 400,
      });
    }
  }

  static validateBatch(req: Request, res: Response, next: NextFunction) {
    try {
      attendanceBatchSchema.parse(req.body);
      next();
    } catch (error) {
      ApiResponse.error({
        res,
        message: "Validation error",
        statusCode: 400,
      });
    }
  }

  static validateUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      attendanceUpdateSchema.parse(req.body);
      next();
    } catch (error) {
      ApiResponse.error({
        res,
        message: "Validation error",
        statusCode: 400,
      });
    }
  }
}
