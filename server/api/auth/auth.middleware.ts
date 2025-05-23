import { Request, Response, NextFunction } from "express";
import { LoginSchema, RegisterSchema } from "./auth.schema";
import { UserService } from "../user/user.service";
import { comparePassword, hashPassword } from "../../utils/bcrypt";
import { validate } from "../../lib/validate";
import { errorResponse } from "../../utils/api-response";

class Middleware {
  async registerMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = validate({
        schema: RegisterSchema,
        data: req.body,
      });

      const checkEmail = await UserService.fetchByEmail(validated.email);
      if (checkEmail) throw new Error(`Email Already Exist`);

      const checkReferralCode = await UserService.fetchByReferralCode(validated.referred_by_code);
      if (validated.referred_by_code && !checkReferralCode) throw new Error(`Referral Code Not Found`);

      req.body = {
        ...validated,
        referred_by_code: checkReferralCode?.referral_code || null,
        password: await hashPassword(validated.password),
      };

      next();
    } catch (error) {
      errorResponse({ res, error });
    }
  }

  async loginMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = validate({
        schema: LoginSchema,
        data: req.body,
      });

      const user = await UserService.fetchByEmail(validated.email);
      if (!user || user.is_deleted) throw new Error(`Email Not Found`);

      const checkPass = await comparePassword(validated.password, user.password);
      if (!checkPass) throw new Error(`Invalid Password`);

      req.body = {
        ...validated,
        user,
      };

      next();
    } catch (error) {
      errorResponse({ res, error });
    }
  }
}

export const AuthMiddlware = new Middleware();
