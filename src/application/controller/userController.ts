import { UserUpdateDTO } from "@dto/user/userUpdateDTO";
import { UserService } from "@service/userService";
import { NotFoundError } from "@utils/errors";
import { noContent, ok } from "@utils/errors/httpErrors";
import { PaginationParams } from "@utils/interfaces";
import { NextFunction, Request, Response } from "express";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getUsersPaginated(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const pagination = this.getPaginationParams(req);
      const users = await this.userService.getUsersPaginated(pagination);
      return ok(res, users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = this.extractUserId(req.params.id);
    if (!userId) return next(new NotFoundError("Invalid user ID"));

    try {
      const user = await this.userService.getUserById(userId);
      return ok(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = this.extractUserId(req.params.id);
    if (!userId) return next(new NotFoundError("Invalid user ID"));

    const updateData = this.getUpdateData(req.body);

    try {
      await this.userService.updateUser(userId, updateData);
      return noContent(res);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = this.extractUserId(req.params.id);
    if (!userId) return next(new NotFoundError("Invalid user ID"));

    try {
      await this.userService.deleteUser(userId);
      return noContent(res);
    } catch (error) {
      next(error);
    }
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private extractUserId(id: string): number | null {
    return !isNaN(Number(id)) ? parseInt(id, 10) : null;
  }

  private getPaginationParams(req: Request): PaginationParams {
    return {
      page: parseInt(req.query.page as string, 10) || 1,
      limit: parseInt(req.query.limit as string, 10) || 10,
    };
  }

  private getUpdateData(data: any): UserUpdateDTO {
    return Object.assign(new UserUpdateDTO(), data);
  }
}
