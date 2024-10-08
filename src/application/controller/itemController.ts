import { ItemUpdateDTO } from "@dto/index";
import { ItemService } from "@service/itemService";
import { BadRequestError, NotFoundError } from "@utils/errors";
import { noContent, ok } from "@utils/errors/httpErrors";
import { PaginationParams } from "@utils/interfaces";
import { NextFunction, Request, Response } from "express";

export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  // ======================================
  // = CRUD =
  // ======================================

  async getItemPaginated(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const pagination: PaginationParams = {
        page: parseInt(req.query.page as string, 10) || 1,
        limit: parseInt(req.query.limit as string, 10) || 10,
      };

      const items = await this.itemService.getPaginatedItems(pagination);
      return ok(res, items);
    } catch (error: any) {
      next(error);
    }
  }

  async getItemByID(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const itemId = this.extractItemId(req.params.id);
    if (!itemId) return next(new BadRequestError("Invalid item ID"));

    try {
      const item = await this.itemService.findOne(itemId);
      return item ? ok(res, item) : next(new NotFoundError("Item not found"));
    } catch (error: any) {
      next(error);
    }
  }

  async updateItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const itemId = this.extractItemId(req.params.id);
    if (!itemId) return next(new BadRequestError("Invalid item ID"));

    const updatedItemDTO = Object.assign(new ItemUpdateDTO(), req.body);

    try {
      await this.itemService.update(itemId, updatedItemDTO, req.file);
      return noContent(res);
    } catch (error: any) {
      next(error);
    }
  }

  async deleteItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const itemId = this.extractItemId(req.params.id);
    if (!itemId) return next(new BadRequestError("Invalid item ID"));

    try {
      await this.itemService.delete(itemId);
      return noContent(res);
    } catch (error: any) {
      next(error);
    }
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private extractItemId = (id: string): number | null =>
    !isNaN(Number(id)) ? parseInt(id, 10) : null;
}
