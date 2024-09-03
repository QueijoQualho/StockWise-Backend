import { ItemUpdateDTO } from "@dto/index";
import { ItemService } from "@service/itemService";
import { BadRequestError, NotFoundError } from "@utils/errors";
import {
  badRequest,
  noContent,
  notFound,
  ok,
  serverError,
} from "@utils/httpErrors";
import { PaginationParams } from "@utils/interfaces";
import { Request, Response } from "express";

export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  // ======================================
  // = CRUD =
  // ======================================

  async getItem(req: Request, res: Response): Promise<void> {
    try {
      const pagination: PaginationParams = {
        page: parseInt(req.query.page as string, 10) || 1,
        limit: parseInt(req.query.limit as string, 10) || 10,
      };

      const items = await this.itemService.getPaginatedItems(pagination);
      return ok(res, items);
    } catch (error: any) {
      if (error instanceof NotFoundError) return noContent(res);
      return serverError(res, error);
    }
  }

  async getItemByID(req: Request, res: Response): Promise<void> {
    const itemId = this.extractItemId(req.params.id);
    if (!itemId) return badRequest(res, new BadRequestError("Invalid item ID"));

    try {
      const item = await this.itemService.findOne(itemId);
      return item
        ? ok(res, item)
        : notFound(res, new NotFoundError("Item not found"));
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  // async createItem(req: Request, res: Response): Promise<void> {
  //   const itemDTO = Object.assign(new ItemDTO(), req.body);

  //   try {
  //     const result = await this.itemService.create(itemDTO, req.file);
  //     return created(res, result);
  //   } catch (error: any) {
  //     if (error instanceof BadRequestError) return badRequest(res, error);
  //     return serverError(res, error);
  //   }
  // }

  async updateItem(req: Request, res: Response): Promise<void> {
    const itemId = this.extractItemId(req.params.id);
    if (!itemId) return badRequest(res, new BadRequestError("Invalid item ID"));

    const updatedItemDTO = Object.assign(new ItemUpdateDTO(), req.body);

    try {
      await this.itemService.update(itemId, updatedItemDTO, req.file);
      return noContent(res);
    } catch (error: any) {
      if (error instanceof BadRequestError) return badRequest(res, error);
      if (error instanceof NotFoundError) return notFound(res, error);
      return serverError(res, error);
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    const itemId = this.extractItemId(req.params.id);
    if (!itemId) return badRequest(res, new BadRequestError("Invalid item ID"));

    try {
      await this.itemService.delete(itemId);
      return noContent(res);
    } catch (error: any) {
      if (error instanceof NotFoundError) return notFound(res, error);
      return serverError(res, error);
    }
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private extractItemId = (id: string): number | null =>
    !isNaN(Number(id)) ? parseInt(id, 10) : null;
}
