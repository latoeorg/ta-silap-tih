import prisma from "../../lib/prisma";

class Service {
  async fetchByEmail(email: string) {
    return await prisma.user.findFirst({
      where: {
        email,
        is_deleted: false,
      },
    });
  }

  // test doang
  async fetchByReferralCode(referral_code: string) {
    return await prisma.user.findFirst({
      where: {
        referral_code,
        is_deleted: false,
      },
    });
  }
}

export const UserService = new Service();
