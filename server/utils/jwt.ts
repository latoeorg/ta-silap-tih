import jwt from "jsonwebtoken";
import { env } from "../lib/env";
import { Role } from "@prisma/client";

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};
