import { Item } from "@model/itemEntity";
import Database from "src/domain/singleton/database";
import { EntityManager, Repository } from "typeorm";

export type ItemRepositoryType = Repository<Item>;
const databaseInstance = Database.getInstance();

const ItemRepository: ItemRepositoryType = databaseInstance
  .getDataSource()
  .getRepository(Item)
  .extend({});

export function getItemRepository(manager?: EntityManager): Repository<Item> {
  if (manager) {
    return manager.withRepository(ItemRepository);
  }
  return ItemRepository;
}
