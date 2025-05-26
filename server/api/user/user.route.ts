import { Router } from "express";
import { UserController } from "./user.controller";
import { authorize } from "../auth/auth.middleware";
import { validate } from "../../lib/validate";
import { updateUserSchema, updateProfileSchema } from "./user.schema";

export const userRouter = Router();

// Get all users
userRouter.get("/", UserController.getAllUsers);

// Get user by ID
userRouter.get("/:id", UserController.getUserById);

// Update user
userRouter.put("/:id", validate(updateUserSchema), UserController.updateUser);

// Update profile
userRouter.put(
  "/profile/update",
  validate(updateProfileSchema),
  UserController.updateProfile
);

// Delete user
userRouter.delete("/:id", authorize(["TEACHER"]), UserController.deleteUser);
