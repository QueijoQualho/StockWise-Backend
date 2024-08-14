import { ItemDTO, ItemUpdateDTO } from "@dto/index";
import { IItemService } from "@interfaces/service/itemServiceInterface";
import { Item } from "@model/itemEntity";
import { Repository } from "typeorm";
import path from "path";
import fs from 'fs';
import { validate, ValidationError } from "class-validator";

export class ItemService implements IItemService {

  constructor(private readonly repository: Repository<Item>) {}

  async findAll(): Promise<Item[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<Item | null> {
    return this.repository.findOneBy({ id }) || null;
  }

  async create(item: ItemDTO): Promise<void> {
    await this.repository.save(item);
  }

  async update(id: number, item: ItemUpdateDTO): Promise<void> {
    const existingItem = await this.findOne(id);
    if (!existingItem) return;

    await this.repository.update(id, item);
  }

  async delete(id: number): Promise<void> {
    const existingItem = await this.findOne(id);
    if (!existingItem) return;

    await this.repository.delete(id);
  }

  async validateItemDTO(itemDTO: ItemDTO | ItemUpdateDTO): Promise<ValidationError[]> {
    return validate(itemDTO);
  }

  async handleFileUpload(file: Express.Multer.File): Promise<string | null> {
    const filePath = file.path;
    if (fs.existsSync(filePath)) {
      return `/uploads/${path.basename(filePath)}`;
    }
    return null;
  }

  async deleteFile(fileUrl?: string): Promise<void> {
    if (!fileUrl) return;

    const filePath = path.resolve(__dirname, "../../../uploads", path.basename(fileUrl));
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  }
}
