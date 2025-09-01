import { Router } from "express";
import { userRouter } from "../api/user/user.route";
import { classGroupRouter } from "../api/classGroup/classGroup.route";
import { subjectRouter } from "../api/subject/subject.route";
import { assessmentWeightRouter } from "../api/assessmentWeight/assessmentWeight.route";
import { dashboardRouter } from "../api/dashboard/dashboard.route";
import courseRouter from "../api/course/course.route";
import gradeRouter from "../api/grade/grade.route";
import gradeComponentRoute from "../api/gradeComponent/gradeComponent.route";
import attandanceRoute from "../api/attandance/attandance.route";
const router = Router();

// Mount the routes correctly
router.use("/user", userRouter);
router.use("/class-group", classGroupRouter);
router.use("/subject", subjectRouter);
router.use("/assessment-weight", assessmentWeightRouter);
router.use("/course", courseRouter); // Assuming course is an alias for subject
router.use("/dashboard", dashboardRouter);
router.use("/grade", gradeRouter);
router.use("/grade-components", gradeComponentRoute);
router.use("/attandance", attandanceRoute);

// Export the router
export const ProtectedRoutes = router;
