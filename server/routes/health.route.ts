import { Router } from "express"
import { database } from "../lib/database"
import { ApiResponse } from "../utils/api-response"
import { asyncHandler } from "../utils/asyncHandler"

const router = Router()

router.get(
  "/health",
  asyncHandler(async (req: any, res: any) => {
    const dbHealth = await database.healthCheck()

    const health = {
      status: dbHealth ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealth ? "connected" : "disconnected",
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || "1.0.0",
    }

    ApiResponse.success({
      res,
      data: health,
      message: "Health check completed",
    })
  }),
)

router.get(
  "/ready",
  asyncHandler(async (req: any, res: any) => {
    const dbHealth = await database.healthCheck()

    if (!dbHealth) {
      return ApiResponse.error({
        res,
        statusCode: 503,
        message: "Service not ready",
      })
    }

    ApiResponse.success({
      res,
      message: "Service is ready",
    })
  }),
)

export { router as healthRouter }
