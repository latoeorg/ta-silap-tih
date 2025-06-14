import { PrismaClient, Role } from "@prisma/client";
import * as bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      name: "Admin User",
      password: await bcryptjs.hash("Admin123!", 10), // Using bcryptjs instead of bcrypt
      role: Role.ADMIN,
    },
  });

  console.log("Admin user created:", adminUser);
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
