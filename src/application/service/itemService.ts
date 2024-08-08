import { IItemService } from "@interfaces/service/itemServiceInterface";
import { Item } from "@model/itemEntity";
import { getUserRepository } from "@repository/itemRepository";
import { NotFoundError } from "@utils/errors";
import { Repository } from "typeorm";

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
    if (!item) {
      throw new NotFoundError("Item not found.");
    }
    return item;
  }

  async create(item: Item): Promise<void> {
    await this.repository.save(item);
  }

  async update(id: number, item: Item): Promise<void> {
    const existingItem = await this.findOne(id);
    if (!existingItem) {
      throw new NotFoundError("Item not found.");
    }
    await this.repository.update(id, item);
  }

  async delete(id: number): Promise<void> {
    const existingItem = await this.findOne(id);
    if (!existingItem) {
      throw new NotFoundError("Item not found.");
    }
    await this.repository.delete(id);
  }
}
