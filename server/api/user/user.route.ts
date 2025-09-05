import { Router } from "express";
import { UserController } from "./user.controller";
import { authorize } from "../auth/auth.middleware";
import { authenticate } from "../auth/auth.middleware";
import { validate } from "../../lib/validate";
import { updateUserSchema } from "./user.schema";
import { UserMiddleware } from "./user.middleware";
import { profilePictureUpload } from "../../middleware/upload";

export const userRouter = Router();

// Get all users
userRouter.get("/", authenticate, UserController.getAllUsers);

//Create user

userRouter.post(
  "/",
  authorize(["TEACHER", "ADMIN"]),
  UserMiddleware.schema,
  UserController.createUser
);
// Get user by ID
userRouter.get("/:id", UserController.getUserById);

// Update user
userRouter.put(
  "/:id",
  authorize(["TEACHER", "ADMIN"]),
  UserMiddleware.schema,
  UserController.updateUser
);

// Update profile
userRouter.put(
  "/profile/update",
  authenticate,
  authorize(["STUDENT", "TEACHER", "ADMIN"]),
  profilePictureUpload,
  UserController.updateProfile
);

// Delete user
userRouter.delete(
  "/:id",
  authorize(["TEACHER", "ADMIN"]),
  UserController.deleteUser
);
