import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../utils/bcrypt";
import { Role, User } from "@prisma/client";

interface RegisterParams {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export class AuthService {
  static async register({
    email,
    password,
    name,
    role,
  }: RegisterParams): Promise<User> {
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        // Create the appropriate profile based on role
        ...(role === "STUDENT"
          ? {
              studentProfile: {
                create: {
                  role,
                  name,
                },
              },
            }
          : {
              teacherProfile: {
                create: {
                  role,
                  name,
                },
              },
            }),
      },
    });

    return user;
  }
}
