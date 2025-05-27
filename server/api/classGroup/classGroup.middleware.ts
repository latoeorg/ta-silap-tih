import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkClassGroupAccess = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Allow admins to access any class group
  if (req.user?.role === Role.ADMIN) {
    return next();
  }

  // Allow homeroom teachers to access their class group
  if (req.user?.role === Role.TEACHER) {
    const classGroup = await prisma.classGroup.findUnique({
      where: { id: req.params.id },
    });

    if (classGroup?.homeroomId === req.user.userId) {
      return next();
    }
  }

  throw new Error("Access denied");
};
