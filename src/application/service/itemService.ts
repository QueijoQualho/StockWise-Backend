import { ItemDTO, ItemUpdateDTO } from "@dto/index";
import { IItemService } from "@interfaces/service/itemServiceInterface";
import { Item } from "@model/itemEntity";
import { getUserRepository } from "@repository/itemRepository";
import { Repository } from "typeorm";
import path from "path";
import fs from 'fs';
import { validate, ValidationError } from "class-validator";

export class ItemService implements IItemService {
  private repository: Repository<Item>;

  constructor() {
    this.repository = getUserRepository();
  }

  async findAll(): Promise<Item[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.repository.findOneBy({ id });
    if (!item) return

    return item;
  }

  async create(item: ItemDTO): Promise<void> {
    await this.repository.save(item);
  }

  async update(id: number, item: ItemUpdateDTO): Promise<void> {
    const existingItem = await this.findOne(id);
    if (!existingItem) return

    await this.repository.update(id, item);
  }

  async delete(id: number): Promise<void> {
    const existingItem = await this.findOne(id);
    if (!existingItem) return
    await this.repository.delete(id);
  }

  async validateItemDTO(itemDTO: ItemDTO | ItemUpdateDTO): Promise<ValidationError[]> {
    return await validate(itemDTO);
  }

  async handleFileUpload(file: Express.Multer.File): Promise<string | null> {
    const filePath = file.path;
    if (fs.existsSync(filePath)) {
      const fileName = path.basename(filePath);
      return `/uploads/${fileName}`;
    }
    return null;

  }

  async deleteFile(fileUrl: string | undefined): Promise<void> {
    console.log(fileUrl);

    if (fileUrl) {
      const filePath = path.join(__dirname, '/../../../uploads', path.basename(fileUrl));
      console.log(filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

}
