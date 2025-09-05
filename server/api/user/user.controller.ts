import { Request, Response } from "express";
import { UserService } from "./user.service";
import { ApiResponse } from "../../utils/api-response";
import { Role } from "@prisma/client";
import fs from "fs";
import path from "path";

export class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const userData = req.body;
      const newUser = await UserService.create(userData);

      // Remove password from response
      const { ...userWithoutPassword } = newUser;

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

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    const {
      role,
      role_exclude,
      search,
      page = "1",
      page_size = "10",
      sort_by = "createdAt",
      sort_order = "desc",
      class_group_id,
      course_id,
    } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(page_size as string, 10);
    const user = req.user;

    try {
      // Role-based access control
      if (user.role === "STUDENT") {
        // Students cannot list other users
        ApiResponse.error({
          res,
          message: "Unauthorized: Students cannot view user lists",
          statusCode: 403,
        });
        return;
      }

      // For teachers, restrict to their courses only
      let courseIdFilter = course_id as string;
      if (user.role === "TEACHER" && course_id) {
        // Verify teacher owns this course
        const course = await UserService.verifyCourseAccess(
          course_id as string,
          user.userId
        );
        if (!course) {
          ApiResponse.error({
            res,
            message: "Unauthorized: You do not teach this course",
            statusCode: 403,
          });
          return;
        }
      }

      const result = await UserService.getAll({
        role: role as string,
        roleExclude: role_exclude as string,
        search: search as string,
        page: pageNumber,
        pageSize,
        sortBy: sort_by as string,
        sortOrder:
          (sort_order as string)?.toLowerCase() === "asc" ? "asc" : "desc",
        classGroupId: class_group_id as string,
        courseId: courseIdFilter,
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
      const { ...userWithoutPassword } = updatedUser;

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
      const file = req.file;

      const user = await UserService.findById(userId);

      if (!user) throw new Error("User not found");

      // If a profile picture is uploaded, add the file path to data
      if (file) {
        data.profilePicture = `/uploads/profile-pictures/${file.filename}`;

        // Delete old profile picture if it exists
        let oldProfilePicture: string | null = null;
        if (user.role === Role.STUDENT && user.studentProfile?.profilePicture) {
          oldProfilePicture = user.studentProfile.profilePicture;
        } else if (
          user.role === Role.TEACHER &&
          user.teacherProfile?.profilePicture
        ) {
          oldProfilePicture = user.teacherProfile.profilePicture;
        }

        if (oldProfilePicture) {
          const oldFilePath = path.join(process.cwd(), oldProfilePicture);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }

      let profile;
      if (user.role === Role.STUDENT) {
        profile = await UserService.updateStudentProfile(user.email, data);
      } else if (user.role === Role.TEACHER) {
        profile = await UserService.updateTeacherProfile(user.email, data);
      }

      ApiResponse.success({
        res,
        data: profile,
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Update profile error:", error);

      // If there was an error and a file was uploaded, clean it up
      if (req.file) {
        const filePath = path.join(
          process.cwd(),
          "uploads/profile-pictures",
          req.file.filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

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
