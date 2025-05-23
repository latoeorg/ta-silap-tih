import jwt from "jsonwebtoken";
import { Env } from "../lib/env";

export const encryptJWT = (payload: any) => {
  return jwt.sign(payload, String(Env.JWT_SECRET));
};

export const decryptJWT = (token: string) => {
  return jwt.sign(token, String(Env.JWT_SECRET));
};
