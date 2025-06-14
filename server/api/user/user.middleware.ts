import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../utils/api-response";
import { Role } from "@prisma/client";
import {
  updateStudentProfileSchema,
  updateTeacherProfileSchema,
} from "./user.schema";
import { ZodError } from "zod";

export class UserMiddleware {
  static async schema(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      switch (user.role) {
        case Role.TEACHER:
          req.body = updateTeacherProfileSchema.parse(req.body);
          break;
        case Role.STUDENT:
          req.body = updateStudentProfileSchema.parse(req.body);
          break;
        case Role.ADMIN:
          break;
        default:
          throw new Error("Unauthorized: You can only update your own profile");
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");

        ApiResponse.error({
          res,
          statusCode: 422,
          message: message || "Validation error",
          error: error.issues,
        });
      }

      next(error);
    }
  }
}
