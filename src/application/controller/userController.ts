import { UserUpdateDTO } from "@dto/user/userUpdateDTO";
import { UserService } from "@service/userService";
import { NotFoundError } from "@utils/errors";
import { noContent, ok } from "@utils/errors/httpErrors";
import { PaginationParams } from "@utils/interfaces";
import { NextFunction, Request, Response } from "express";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getUsersPaginated(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination: PaginationParams = {
        page: parseInt(req.query.page as string, 10) || 1,
        limit: parseInt(req.query.limit as string, 10) || 10,
      };

      const users = await this.userService.getUsersPaginated(pagination);
      return ok(res, users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.extractUserId(req.params.id)
      if (!userId) return next(new NotFoundError("Invalid user ID"));

      const user = await this.userService.getUserById(userId);
      return ok(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.extractUserId(req.params.id)
      if (!userId) return next(new NotFoundError("Invalid user ID"));

      const updateData = Object.assign(new UserUpdateDTO(), req.body);

      await this.userService.updateUser(userId, updateData);
      return noContent(res);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId  = this.extractUserId(req.params.id)
      if (!userId) return next(new NotFoundError("Invalid user ID"));

      await this.userService.deleteUser(userId);
      return noContent(res);
    } catch (error) {
      next(error);
    }
  }

  private extractUserId = (id: string): number | null =>
    !isNaN(Number(id)) ? parseInt(id, 10) : null;
}
