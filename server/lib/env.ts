import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("3000"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().default("your-secret-key"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  API_URL: z.string().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
