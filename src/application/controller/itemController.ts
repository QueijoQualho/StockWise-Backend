// src/controllers/itemController.ts
import { Request, Response } from 'express';
import { Item } from '@model/itemEntity';
import { IItemController } from '@interfaces/controller/itemControllerInterface';
import { IItemService } from '@interfaces/service/itemServiceInterface';
import { ok, serverError, notFound, created, noContent, badRequest } from '@utils/httpErrors';
import { NotFoundError, BadRequestError } from '@utils/errors';

export class ItemController implements IItemController {
  constructor(private itemService: IItemService) { }

  async getItem(_: Request, res: Response): Promise<void> {
    try {
      const items = await this.itemService.getItem();
      ok(res, items);
    } catch (error: any) {
      serverError(res, error);
    }
  }

  async getItemByID(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const itemId = parseInt(id, 10);

      if (isNaN(itemId)) {
        return badRequest(res, new BadRequestError('Invalid item ID'));
      }

      const item = await this.itemService.getItemByID(itemId);
      ok(res, item);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        notFound(res, error);
      } else {
        serverError(res, error);
      }
    }
  }

  async createItem(req: Request, res: Response): Promise<void> {
    try {
      const newItem: Item = req.body;

      if (!newItem) {
        return badRequest(res, new BadRequestError('Invalid item'));
      }

      const item = await this.itemService.createItem(newItem);
      created(res, item);
    } catch (error: any) {
      serverError(res, error);
    }
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const itemId = parseInt(id, 10);
      const updatedItem: Item = req.body;

      if (isNaN(itemId)) {
        return badRequest(res, new BadRequestError('Invalid item ID'));
      }

      await this.itemService.updateItem(itemId, updatedItem);
      noContent(res);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        notFound(res, error);
      } else {
        serverError(res, error);
      }
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const itemId = parseInt(id, 10);

      if (isNaN(itemId)) {
        return badRequest(res, new BadRequestError('Invalid item ID'));
      }

      await this.itemService.deleteItem(itemId);
      noContent(res);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        notFound(res, error);
      } else {
        serverError(res, error);
      }
    }
  }
}
