import { Router } from "express";
import { userRouter } from "../api/user/user.route";

export const ProtectedRoutes = Router().use("/user", userRouter);
