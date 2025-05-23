import { errorResponse, successResponse } from "../../utils/api-response";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { encryptJWT } from "../../utils/jwt";
import { User } from "../../prisma/generated";

class Controller {
  async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register({
        data: req.body,
      });

      successResponse({
        res,
        data: result,
      });
    } catch (error) {
      errorResponse({ res, error });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const user: User = req.body.user;
      delete (user as any).password;

      const token = await encryptJWT(user);

      const response = {
        token,
        user,
      };

      successResponse({ res, data: response });
    } catch (error) {
      errorResponse({ res, error });
    }
  }
}

export const AuthController = new Controller();
