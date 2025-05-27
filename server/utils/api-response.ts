import { Response } from "express";

export class ApiResponse {
  static success<T>({
    res,
    data,
    message = "Success",
    statusCode = 200,
    meta,
  }: {
    res: Response;
    data?: T;
    message?: string;
    statusCode?: number;
    meta?: any;
  }) {
    return res.status(statusCode).json({
      success: true,
      message,
      meta,
      data,
    });
  }

  static error({
    res,
    message = "Error",
    statusCode = 500,
    error,
  }: {
    res: Response;
    message?: string;
    statusCode?: number;
    error?: any;
  }) {
    if (error instanceof Error) {
      message = error.message;
    }

    return res.status(statusCode).json({
      success: false,
      message,
      errors: error,
    });
  }
}
