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
import fs from 'fs'

export class ItemController implements IItemController {
  constructor(private readonly itemService: IItemService) { }

  // ======================================
  // = CRUD =
  // ======================================

  async getItem(_: Request, res: Response): Promise<void> {
    try {
      const items = await this.itemService.findAll();
      return ok(res, items);
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  async getItemByID(req: Request, res: Response): Promise<void> {
    const itemId = this.extractItemId(req.params.id);
    if (!itemId) return badRequest(res, new BadRequestError("Invalid item ID"));

    try {
      const item = await this.itemService.findOne(itemId);
      return item ? ok(res, item) : notFound(res, new NotFoundError("Item not found"));
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  async createItem(req: Request, res: Response): Promise<void> {
    const itemDTO = Object.assign(new ItemDTO(), req.body);

    try {
      const validationErrors = await this.validateAndHandleFile(req, itemDTO);
      if (validationErrors) return badRequest(res, validationErrors);

      await this.itemService.create(itemDTO);
      return created(res, itemDTO);
    } catch (error: any) {
      return this.handleServerError(res, error, itemDTO.url);
    }
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    const itemId = this.extractItemId(req.params.id);
    if (!itemId) return badRequest(res, new BadRequestError("Invalid item ID"));

    const updatedItemDTO = Object.assign(new ItemUpdateDTO(), req.body);

    try {
      const validationErrors = await this.validateAndHandleFile(req, updatedItemDTO, itemId);
      if (validationErrors) return badRequest(res, validationErrors);

      await this.itemService.update(itemId, updatedItemDTO);
      return noContent(res);
    } catch (error: any) {
      return this.handleServerError(res, error, updatedItemDTO.url);
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    const itemId = this.extractItemId(req.params.id);
    if (!itemId) return badRequest(res, new BadRequestError("Invalid item ID"));

    try {
      const item = await this.itemService.findOne(itemId);
      if (!item) return notFound(res, new NotFoundError("Item not found"));

      await Promise.all([
        this.deleteFileIfExists(item.url),
        this.itemService.delete(itemId)
      ]);

      return noContent(res);
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private extractItemId = (id: string): number | null =>
    !isNaN(Number(id)) ? parseInt(id, 10) : null;

  private formatValidationErrors = (errors: ValidationError[]): string =>
    errors.flatMap(err => Object.values(err.constraints || {})).join("; ");

  private async validateAndHandleFile(
    req: Request,
    itemDTO: ItemDTO | ItemUpdateDTO,
    itemId?: number
  ): Promise<BadRequestError | null> {
    const validationErrors = await this.itemService.validateItemDTO(itemDTO);
    if (validationErrors.length > 0) {
      this.deleteUploadedFile(req.file?.path);
      return new BadRequestError(this.formatValidationErrors(validationErrors));
    }

    const fileUrlOrError = await this.processFileHandling(req.file, itemId);
    if (fileUrlOrError instanceof Error) return fileUrlOrError;

    itemDTO.url = fileUrlOrError as string;
    return null;
  }

  private async processFileHandling(
    file: Express.Multer.File | undefined,
    itemId?: number
  ): Promise<string | BadRequestError | NotFoundError | null> {
    if (!file) return null;

    const fileUrl = await this.itemService.handleFileUpload(file);
    if (!fileUrl) return new BadRequestError("Erro ao processar o arquivo.");

    if (itemId) {
      const existingItem = await this.itemService.findOne(itemId);
      if (!existingItem) return new NotFoundError("Item não encontrado");

      await this.deleteFileIfExists(existingItem.url);
    }

    return fileUrl;
  }

  private deleteUploadedFile(filePath?: string): void {
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  }

  private async deleteFileIfExists(fileUrl?: string): Promise<void> {
    if (fileUrl) {
      await this.itemService.deleteFile(fileUrl);
    }
  }

  private async handleServerError(res: Response, error: any, fileUrl?: string): Promise<void> {
    if (fileUrl) await this.itemService.deleteFile(fileUrl);
    return serverError(res, error);
  }
}
