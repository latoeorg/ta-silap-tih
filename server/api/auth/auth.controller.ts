import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../../utils/api-response";
import { generateToken } from "../../utils/jwt";
import { comparePassword } from "../../utils/bcrypt";
import { UserService } from "../user/user.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;

      // Check if user already exists
      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      // Create new user
      const user = await AuthService.register({ email, password, name, role });

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      ApiResponse.success({
        res,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
        statusCode: 201,
      });
    } catch (error) {
      console.error("Register error:", error);
      ApiResponse.error({
        res,
        statusCode: 400,
        error,
      });
    }
  }

  static async login(req: Request, res: Response) {
    console.log({
      body: req.body,
    });
    

    try {
      const { email, password } = req.body;

      // Find user
      const user = await UserService.findByEmail(email);
      if (!user) throw new Error("User not found");

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) throw new Error("Invalid password");

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      ApiResponse.success({
        res,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
        message: "Login successful",
      });
    } catch (error) {
      console.error("Login error:", error);
      ApiResponse.error({
        res,
        statusCode: 400,
        error,
      });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const user = await UserService.findById(userId);

      if (!user) throw new Error("User not found");

      // Filter out sensitive information
      const { password, ...userWithoutPassword } = user;

      ApiResponse.success({
        res,
        data: userWithoutPassword,
        message: "User profile retrieved successfully",
      });
    } catch (error) {
      console.error("Get profile error:", error);
      ApiResponse.error({
        res,
        statusCode: 400,
        error,
      });
    }
  }
}
