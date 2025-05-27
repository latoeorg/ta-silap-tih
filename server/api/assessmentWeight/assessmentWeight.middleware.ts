import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkAssessmentWeightAccess = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Allow admins to access any assessment weight
  if (req.user?.role === Role.ADMIN) {
    return next();
  }

  // Teachers can access assessment weights they created
  if (req.user?.role === Role.TEACHER) {
    const assessmentWeight = await prisma.assessmentWeight.findUnique({
      where: { id: req.params.id },
    });

    if (assessmentWeight?.createdById === req.user.userId) {
      return next();
    }
  }

  throw new Error("Access denied");
};
