import { Request, Response } from "express";
import { UserService } from "./user.service";
import { ApiResponse } from "../../utils/api-response";

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const { role } = req.query;
      const users = await UserService.getAll(role as any);
      ApiResponse.success({
        res,
        data: users,
        message: "Users retrieved successfully",
      });
    } catch (error) {
      console.error("Get all users error:", error);
      ApiResponse.error({ res, message: "Failed to retrieve users", error });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.findById(id);

      if (!user) throw new Error("User not found");

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      ApiResponse.success({
        res,
        data: userWithoutPassword,
        message: "User retrieved successfully",
      });
    } catch (error) {
      console.error("Get user by ID error:", error);
      ApiResponse.error({ res, message: "Failed to retrieve user", error });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      // Check if user exists
      const existingUser = await UserService.findById(id);
      if (!existingUser) throw new Error("User not found");

      // Check if user is trying to update someone else's profile
      if (req.user.userId !== id && req.user.role !== "TEACHER")
        throw new Error(
          "Unauthorized: You can only update your own profile or if you are a teacher"
        );

      const updatedUser = await UserService.update(id, data);

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;

      ApiResponse.success({
        res,
        data: userWithoutPassword,
        message: "User updated successfully",
      });
    } catch (error) {
      console.error("Update user error:", error);
      ApiResponse.error({ res, message: "Failed to update user", error });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const data = req.body;
      const user = await UserService.findById(userId);

      if (!user) throw new Error("User not found");

      let profile;
      if (user.role === "STUDENT") {
        profile = await UserService.updateStudentProfile(user.email, data);
      } else {
        profile = await UserService.updateTeacherProfile(user.email, data);
      }

      ApiResponse.success({
        res,
        data: profile,
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Update profile error:", error);
      ApiResponse.error({ res, message: "Failed to update profile", error });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Only admins or teachers can delete users
      if (req.user.role !== "TEACHER")
        throw new Error("Unauthorized: Only teachers can delete users");
      // Check if user exists
      const existingUser = await UserService.findById(id);
      if (!existingUser) throw new Error("User not found");

      await UserService.delete(id);
      ApiResponse.success({ res, message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      ApiResponse.error({ res, message: "Failed to delete user", error });
    }
  }
}
