import { LoginDTO } from "@dto/user/loginDTO";
import { ok, serverError } from "@utils/httpErrors";
import { Request, Response } from "express";


export class AuthController {
  constructor(private readonly authService: AuthService ) {}

  async login(req: Request, res: Response) {
    try {
      const loginDTO = Object.assign(new LoginDTO(), req.body);
      const token = this.authService.login(loginDTO)
      ok(res,token)
    } catch (e) {
      serverError(res, e)
    }
  }

  async signup(req: Request, res: Response) {
    try {

    } catch (error) {

    }
  }
}
