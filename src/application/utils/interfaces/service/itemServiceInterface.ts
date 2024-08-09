import { ItemDTO, ItemUpdateDTO } from "@dto/index";
import { Item } from "@model/itemEntity";
import { ValidationError } from "class-validator";

export interface IItemService {
  findAll(): Promise<Item[]>;
  findOne(id: number): Promise<Item>;
  create(item: ItemDTO): Promise<void>;
  update(id: number, item: ItemUpdateDTO): Promise<void>;
  delete(id: number): Promise<void>;

  validateItemDTO(itemDTO: ItemDTO | ItemUpdateDTO): Promise<ValidationError[]>
  handleFileUpload(file: Express.Multer.File): Promise<string | null>
  deleteFile(fileUrl: string | undefined): Promise<void>
}
