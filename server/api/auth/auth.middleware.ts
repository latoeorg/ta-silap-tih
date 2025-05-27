import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../../utils/jwt";
import { ApiResponse } from "../../utils/api-response";
import { Role } from "@prisma/client";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user: TokenPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    ApiResponse.error({
      res,
      message: "Unauthorized: Invalid token",
      error,
    });
  }
};

export const authorize = (roles: Role[] | Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new Error("Unauthorized: User not authenticated");
    }

    if (typeof roles === "string") {
      roles = [roles];
    }

    if (!roles.includes(req.user.role)) {
      throw new Error(
        `Forbidden: User does not have the required role. Required roles: ${roles.join(
          ", "
        )}, but user has: ${req.user.role}`
      );
    }

    next();
  };
};
