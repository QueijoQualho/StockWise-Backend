import { Item } from "@model/itemEntity";
import { EntityManager, Repository } from "typeorm";
import Database from "../singleton/database";

export type ItemRepositoryType = Repository<Item>;
const databaseInstance = Database.getInstance();

const itemRepository: ItemRepositoryType = databaseInstance
  .getDataSource()
  .getRepository(Item)
  .extend({});

export function getItemRepository(manager?: EntityManager): Repository<Item> {
  if (manager) {
    return manager.withRepository(itemRepository);
  }
  return itemRepository;
}
