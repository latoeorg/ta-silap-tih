import { Router } from "express";
import { userRouter } from "../api/user/user.route";
import { classGroupRouter } from "../api/classGroup/classGroup.route";
import { subjectRouter } from "../api/subject/subject.route";
import { assessmentWeightRouter } from "../api/assessmentWeight/assessmentWeight.route";

export const ProtectedRoutes = Router()
  .use("/user", userRouter)
  .use("/class-group", classGroupRouter)
  .use("/subject", subjectRouter)
  .use("/assessment-weight", assessmentWeightRouter);
