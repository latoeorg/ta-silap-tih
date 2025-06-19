import { PrismaClient, Role } from "@prisma/client";
import * as bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminUser = await prisma.user.createMany({
    data: [
      {
        email: "admin@gmail.com",
        name: "Admin User",
        password: await bcryptjs.hash("Pass1234", 10), // Using bcryptjs instead of bcrypt
        role: Role.ADMIN,
      },
    ],
    skipDuplicates: true, // Skip if the user already exists
  });

  console.log("Admin user created:", await prisma.user.count());
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
