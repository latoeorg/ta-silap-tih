import prisma from "../../lib/prisma";
import { RegisterSchema } from "./auth.schema";
import { generateReferralCode } from "../../utils/referral-code-generator";
import { UserRole } from "../../prisma/generated";

class Service {
  async register({ data }: { data: RegisterSchema }) {
    const referralCode = await prisma.user
      .findMany({
        select: { referral_code: true },
      })
      .then((codes) => codes.map((code) => code.referral_code));

    return await prisma.user.create({
      data: {
        ...data,
        role: UserRole.CUSTOMER,
        referral_code: generateReferralCode(referralCode),
      },
    });
  }
}

export const AuthService = new Service();
