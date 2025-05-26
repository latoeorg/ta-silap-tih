import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiResponse } from "../utils/api-response";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((err) => err.message).join(", ");

        ApiResponse.error({
          res,
          message: message || "Validation failed",
          statusCode: 400,
          error,
        });
      }
      next(error);
    }
  };
