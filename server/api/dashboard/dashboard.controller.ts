import type { Request, Response } from "express"
import { DashboardService } from "./dashboard.service"
import { ApiResponse } from "../../utils/api-response"

export class DashboardController {
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await DashboardService.getStats()

      ApiResponse.success({
        res,
        data: stats,
        message: "Dashboard stats retrieved successfully",
      })
    } catch (error) {
      console.error("Dashboard stats error:", error)
      ApiResponse.error({
        res,
        statusCode: 500,
        error,
      })
    }
  }

  static async getOverview(req: Request, res: Response) {
    try {
      const overview = await DashboardService.getOverview()

      ApiResponse.success({
        res,
        data: overview,
        message: "Dashboard overview retrieved successfully",
      })
    } catch (error) {
      console.error("Dashboard overview error:", error)
      ApiResponse.error({
        res,
        statusCode: 500,
        error,
      })
    }
  }

  static async getUserStats(req: Request, res: Response) {
    try {
      const userId = req.user.userId
      const userRole = req.user.role

      const userStats = await DashboardService.getUserStats(userId, userRole)

      ApiResponse.success({
        res,
        data: userStats,
        message: "User dashboard stats retrieved successfully",
      })
    } catch (error) {
      console.error("User dashboard stats error:", error)
      ApiResponse.error({
        res,
        statusCode: 500,
        error,
      })
    }
  }

  static async getRecentActivity(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 10
      const activities = await DashboardService.getRecentActivity(limit)

      ApiResponse.success({
        res,
        data: activities,
        message: "Recent activities retrieved successfully",
      })
    } catch (error) {
      console.error("Recent activity error:", error)
      ApiResponse.error({
        res,
        statusCode: 500,
        error,
      })
    }
  }
}
