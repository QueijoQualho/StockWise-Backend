import { IItemService } from '@interfaces/service/itemServiceInterface';
import { Item } from '@model/itemEntity';
import { getUserRepository } from '@repository/itemRepository';
import { Repository } from 'typeorm';

export class ItemService implements IItemService {
  private repository: Repository<Item>;

  constructor() {
    this.repository = getUserRepository();
  }

  async getItem(): Promise<Item[]> {
    return await this.repository.find();
  }

  async getItemByID(id: number): Promise<Item> {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new Error('Item not found.');
    }
    return item;
  }

  async createItem(item: Item): Promise<void> {
    await this.repository.save(item);
  }

  async updateItem(id: number, item: Item): Promise<void> {
    const existingItem = await this.getItemByID(id);
    if (!existingItem) {
      throw new Error('Item not found.');
    }
    await this.repository.update(id, item);
  }

  async deleteItem(id: number): Promise<void> {
    const existingItem = await this.getItemByID(id);
    if (!existingItem) {
      throw new Error('Item not found.');
    }
    await this.repository.delete(id);
  }
}
