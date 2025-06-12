import { Request, Response } from "express";
import { UserService } from "./user.service";
import { ApiResponse } from "../../utils/api-response";

export class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const userData = req.body;
      const newUser = await UserService.create(userData);

      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;

      ApiResponse.success({
        res,
        data: userWithoutPassword,
        message: "User created successfully",
      });
    } catch (error) {
      console.error("Create user error:", error);
      ApiResponse.error({ res, message: "Failed to create user", error });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    const {
      role,
      role_exclude,
      search,
      page = "1",
      page_size = "10",
      sort_by = "createdAt",
      sort_order = "desc",
    } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(page_size as string, 10);
    try {
      const result = await UserService.getAll({
        role: role as string,
        roleExclude: role_exclude as string,
        search: search as string,
        page: pageNumber,
        pageSize,
        sortBy: sort_by as string,
        sortOrder:
          (sort_order as string)?.toLowerCase() === "asc" ? "asc" : "desc",
      });

      ApiResponse.success({
        res,
        data: result.users,
        pagination: {
          total_items: result.total,
          page: pageNumber,
          page_size: pageSize,
          total_pages: Math.ceil(result.total / pageSize),
        },
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
      if (req.user.userId !== id && req.user.role !== "ADMIN")
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
