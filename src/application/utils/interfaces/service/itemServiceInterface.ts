import { Item } from "@model/itemEntity";

export interface IItemService {
  getItem(): Promise<Item[]>;
  getItemByID(id: number): Promise<Item>;
  createItem(item: Item): Promise<void>;
  updateItem(id: number, item: Item): Promise<void>;
  deleteItem(id: number): Promise<void>;
}
