import { Router } from "express";
import { userRouter } from "../api/user/user.route";
import { classGroupRouter } from "../api/classGroup/classGroup.route";
import { subjectRouter } from "../api/subject/subject.route";
import { assessmentWeightRouter } from "../api/assessmentWeight/assessmentWeight.route";
import { dashboardRouter } from "../api/dashboard/dashboard.route";

// Create a router instance
const router = Router();

// Mount the routes correctly
router.use("/user", userRouter);
router.use("/class-group", classGroupRouter);
router.use("/subject", subjectRouter);
router.use("/assessment-weight", assessmentWeightRouter);
router.use("/dashboard", dashboardRouter);

// Export the router
export const ProtectedRoutes = router;
