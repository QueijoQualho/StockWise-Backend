import { UserService } from "@service/userService";
import { ok } from "@utils/errors/httpErrors";
import { PaginationParams } from "@utils/interfaces";
import { NextFunction, Request, Response } from "express";

export class UserController {

  constructor(private readonly userService: UserService) {  }

  async getUsersPaginated (req: Request, res: Response, next: NextFunction) {
    try {
      const pagination: PaginationParams = {
        page: parseInt(req.query.page as string, 10) || 1,
        limit: parseInt(req.query.limit as string, 10) || 10,
      };

      const user = await this.userService.getUsersPaginated(pagination);
      return ok(res, user)
    } catch (error) {
      next(error)
    }
  }

}
