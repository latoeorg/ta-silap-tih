import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { Prisma } from "@prisma/client"
import { logger } from "../lib/logger"
import { ApiResponse } from "../utils/api-response"

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err }
  error.message = err.message

  // Log error
  logger.error(err)

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found"
    error = new AppError(message, 404)
  }

  // Prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    const message = "Invalid data provided"
    error = new AppError(message, 400)
  }

  // Prisma known request error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const message = "Duplicate field value entered"
      error = new AppError(message, 400)
    }
    if (err.code === "P2025") {
      const message = "Record not found"
      error = new AppError(message, 404)
    }
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const message = err.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ")
    error = new AppError(message, 400)
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token"
    error = new AppError(message, 401)
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired"
    error = new AppError(message, 401)
  }

  ApiResponse.error({
    res,
    message: error.message || "Server Error",
    statusCode: (error as AppError).statusCode || 500,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
}
