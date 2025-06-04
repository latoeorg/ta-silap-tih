import { Router } from "express"
import { DashboardController } from "./dashboard.controller"
import { authenticate, authorize } from "../auth/auth.middleware"
import { Role } from "@prisma/client"

const router = Router()

// Protected routes
router.use(authenticate)

// Get general dashboard stats (all authenticated users)
router.get("/stats", DashboardController.getStats)

// Get dashboard overview (all authenticated users)
router.get("/overview", DashboardController.getOverview)

// Get user-specific dashboard stats
router.get("/user-stats", DashboardController.getUserStats)

// Get recent activity (admins and teachers)
router.get("/recent-activity", authorize([Role.ADMIN, Role.TEACHER]), DashboardController.getRecentActivity)

export { router as dashboardRouter }
