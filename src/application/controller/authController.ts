import { LoginDTO } from "@dto/user/loginDTO";
import { SignupDTO } from "@dto/user/signupDTO";
import { AuthService } from "@service/auth/authService";
import { ok } from "@utils/errors/httpErrors";
import { NextFunction, Request, Response } from "express";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginDTO = Object.assign(new LoginDTO(), req.body);
      const token = await this.authService.login(loginDTO);
      ok(res, token);
    } catch (e) {
      next(e);
    }
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const signupDTO = Object.assign(new SignupDTO(), req.body);
      const user = await this.authService.signup(signupDTO);
      ok(res, user);
    } catch (e) {
      next(e);
    }
  }
}
