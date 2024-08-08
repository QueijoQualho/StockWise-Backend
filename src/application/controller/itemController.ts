import { Request, Response } from "express";
import { Item } from "@model/itemEntity";
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
import { ItemDTO } from "@dto/ItemDTO";
import { validate, ValidationError } from "class-validator";

export class ItemController implements IItemController {
  constructor(private readonly itemService: IItemService) {}

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

    const validationErrors = await this.validateItemDTO(itemDTO);
    if (validationErrors.length > 0) {
      return badRequest(
        res,
        new BadRequestError(this.formatValidationErrors(validationErrors)),
      );
    }

    try {
      const item = await this.itemService.create(itemDTO);
      created(res, item);
    } catch (error: any) {
      serverError(res, error);
    }
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    const itemId = this.extractItemId(req.params.id);

    if (itemId === null) {
      return badRequest(res, new BadRequestError("Invalid item ID"));
    }

    try {
      const updatedItem: Item = req.body;
      await this.itemService.update(itemId, updatedItem);
      noContent(res);
    } catch (error: any) {
      serverError(res, error);
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    const itemId = this.extractItemId(req.params.id);

    if (itemId === null) {
      return badRequest(res, new BadRequestError("Invalid item ID"));
    }

    try {
      await this.itemService.delete(itemId);
      noContent(res);
    } catch (error: any) {
      serverError(res, error);
    }
  }

  /* Other methods */
  private extractItemId(id: string): number | null {
    const itemId = parseInt(id, 10);
    return isNaN(itemId) ? null : itemId;
  }

  private async validateItemDTO(itemDTO: ItemDTO): Promise<ValidationError[]> {
    return await validate(itemDTO);
  }

  private formatValidationErrors(errors: ValidationError[]): string {
    return `${errors.map((err) => Object.values(err.constraints || {}).join(", ")).join("; ")}`;
  }
}
