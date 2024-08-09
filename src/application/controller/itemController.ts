import { Request, Response } from "express";
import {
  ok,
  serverError,
  notFound,
  created,
  noContent,
  badRequest,
} from "@utils/httpErrors";
import { NotFoundError, BadRequestError } from "@utils/errors";
import { IItemController, IItemService } from "@interfaces/index";
import { ItemDTO } from "@dto/item/ItemDTO";
import { ItemUpdateDTO } from "@dto/index";
import { ValidationError } from "class-validator";
import fs from 'fs';

export class ItemController implements IItemController {
  constructor(private readonly itemService: IItemService) { }

  async getItem(_: Request, res: Response): Promise<void> {
    try {
      const items = await this.itemService.findAll();
      ok(res, items);
    } catch (error: any) {
      serverError(res, error);
    }
  }

  async getItemByID(req: Request, res: Response): Promise<void> {
    const itemId = this.extractItemId(req.params.id);

    if (itemId === null) {
      return badRequest(res, new BadRequestError("Invalid item ID"));
    }

    try {
      const item = await this.itemService.findOne(itemId);
      if (!item) {
        return notFound(res, new NotFoundError("Item not found"));
      }
      ok(res, item);
    } catch (error: any) {
      serverError(res, error);
    }
  }

  async createItem(req: Request, res: Response): Promise<void> {
    const itemDTO = Object.assign(new ItemDTO(), req.body);
    let fileUrl: string | null = null;

    try {
      const validationErrors = await this.itemService.validateItemDTO(itemDTO);
      if (validationErrors.length > 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return badRequest(
          res,
          new BadRequestError(this.formatValidationErrors(validationErrors))
        );
      }

      if (req.file) {
        fileUrl = await this.itemService.handleFileUpload(req.file);
        if (!fileUrl) {
          return badRequest(res, new BadRequestError('Erro ao processar o arquivo.'));
        }
        itemDTO.url = fileUrl;
      }

      await this.itemService.create(itemDTO);
      created(res, itemDTO);
    } catch (error: any) {
      if (fileUrl) {
        await this.itemService.deleteFile(fileUrl);
      }
      serverError(res, error);
    }
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    const itemId = this.extractItemId(req.params.id);

    if (!itemId) {
      return badRequest(res, new BadRequestError("Invalid item ID"));
    }

    const updatedItemDTO = Object.assign(new ItemUpdateDTO(), req.body);
    let fileUrl: string | null = null;

    try {
      const validationErrors = await this.itemService.validateItemDTO(updatedItemDTO);
      if (validationErrors.length > 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return badRequest(res, new BadRequestError(this.formatValidationErrors(validationErrors)));
      }

      const existingItem = await this.itemService.findOne(itemId);
      if (!existingItem) {
        return notFound(res, new NotFoundError("Item not found"));
      }

      if (req.file) {
        fileUrl = await this.itemService.handleFileUpload(req.file);
        if (!fileUrl) {
          return badRequest(res, new BadRequestError('Erro ao processar o arquivo.'));
        }

        if (existingItem.url) {
          await this.itemService.deleteFile(existingItem.url);
        }
        updatedItemDTO.url = fileUrl;
      }

      await this.itemService.update(itemId, updatedItemDTO);
      noContent(res);
    } catch (error: any) {
      if (fileUrl) {
        await this.itemService.deleteFile(fileUrl);
      }
      serverError(res, error);
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    const itemId = this.extractItemId(req.params.id);

    if (itemId === null) {
      return badRequest(res, new BadRequestError("Invalid item ID"));
    }

    try {
      const item = await this.itemService.findOne(itemId);
      if (!item) {
        return notFound(res, new NotFoundError("Item not found"));
      }

      if (item.url) {
        await this.itemService.deleteFile(item.url);
      }

      await this.itemService.delete(itemId);
      noContent(res);
    } catch (error: any) {
      serverError(res, error);
    }
  }

  /* Helper methods */
  private extractItemId(id: string): number | null {
    const itemId = parseInt(id, 10);
    return isNaN(itemId) ? null : itemId;
  }

  private formatValidationErrors(errors: ValidationError[]): string {
    return `${errors.map((err) => Object.values(err.constraints || {}).join(", ")).join("; ")}`;
  }
}
