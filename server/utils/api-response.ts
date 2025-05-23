import { Response } from "express";

interface ISuccessResponse {
  res: Response;
  data: any;
  pagination?: {
    pageSize: number;
    page: number;
    totalPages: number;
    totalItems: number;
  };
}

interface IError {
  res: Response;
  error?: any;
  statusCode?: number; // optional override
}

export const successResponse = ({ res, data, pagination }: ISuccessResponse) => {
  return res.status(200).json({
    code: 200,
    status: "success",
    data,
    pagination,
  });
};

export const errorResponse = ({ res, error = null, statusCode }: IError) => {
  let message = "Something went wrong";

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (error?.message) {
    message = error.message;
  }

  // Default to 400 if no statusCode is provided
  const code = statusCode ?? 400;

  return res.status(code).json({
    code,
    status: "error",
    message,
  });
};
