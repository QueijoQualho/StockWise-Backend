import { Item } from '@model/item.js';
import { IItemService } from '@interfaces/service/itemServiceInterface.js';

export class ItemService implements IItemService {
  getItem(): Item[] {
    throw new Error('Method not implemented.');
  }
  getItemByID(id: number): Item {
    throw new Error('Method not implemented.');
  }
  createItem(item: Item): void {
    throw new Error('Method not implemented.');
  }
  updateItem(id: number, item: Item): void {
    throw new Error('Method not implemented.');
  }
  deleteItem(id: number): void {
    throw new Error('Method not implemented.');
  }
}
