import { Item } from '../../../../model/item.js';

export interface IItemService {
  getItem(): Item[];
  getItemByID(id: number): Item;
  createItem(item: Item): void;
  updateItem(id: number, item: Item): void;
  deleteItem(id: number): void;
}
