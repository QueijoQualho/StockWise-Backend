import { Item } from "@model/itemEntity";

export interface IItemService {
  findAll(): Promise<Item[]>;
  findOne(id: number): Promise<Item>;
  create(item: Item): Promise<void>;
  update(id: number, item: Item): Promise<void>;
  delete(id: number): Promise<void>;
}
